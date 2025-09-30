-- Remove the SECURITY DEFINER view to address security warning
DROP VIEW IF EXISTS user_integrations_decrypted;

-- Create a secure function instead of a view to get decrypted integration
-- This is more secure as it explicitly validates the user and returns only their data
CREATE OR REPLACE FUNCTION get_user_integration(integration_platform text)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  platform text,
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone,
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Return decrypted integration for the authenticated user only
  RETURN QUERY
  SELECT
    i.id,
    i.user_id,
    i.platform,
    decrypt_token(i.access_token) as access_token,
    decrypt_token(i.refresh_token) as refresh_token,
    i.expires_at,
    i.is_active,
    i.created_at,
    i.updated_at
  FROM public.integrations i
  WHERE i.user_id = auth.uid()
    AND i.platform = integration_platform
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_integration TO authenticated;

COMMENT ON FUNCTION get_user_integration IS 'Securely retrieves and decrypts integration tokens for the authenticated user only';