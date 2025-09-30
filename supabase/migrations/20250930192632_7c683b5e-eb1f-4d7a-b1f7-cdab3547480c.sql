-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a secure function to get encryption key from Supabase secrets
-- In production, this would use vault.secrets, but for now we'll use a function
CREATE OR REPLACE FUNCTION get_encryption_key()
RETURNS bytea
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This uses a deterministic key derived from the project
  -- In production, you should store this in Supabase Vault
  RETURN digest('supabase-integration-encryption-key-mpexfodveltykplhvfiz', 'sha256');
END;
$$;

-- Create function to encrypt sensitive tokens
CREATE OR REPLACE FUNCTION encrypt_token(token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF token IS NULL OR token = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN encode(
    encrypt(
      token::bytea,
      get_encryption_key(),
      'aes'
    ),
    'base64'
  );
END;
$$;

-- Create function to decrypt sensitive tokens
CREATE OR REPLACE FUNCTION decrypt_token(encrypted_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF encrypted_token IS NULL OR encrypted_token = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN convert_from(
    decrypt(
      decode(encrypted_token, 'base64'),
      get_encryption_key(),
      'aes'
    ),
    'utf8'
  );
END;
$$;

-- Create a secure view that only shows decrypted tokens to the owner
CREATE OR REPLACE VIEW user_integrations_decrypted AS
SELECT
  id,
  user_id,
  platform,
  decrypt_token(access_token) as access_token,
  decrypt_token(refresh_token) as refresh_token,
  expires_at,
  is_active,
  created_at,
  updated_at
FROM public.integrations
WHERE user_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON user_integrations_decrypted TO authenticated;

-- Create trigger function to auto-encrypt tokens on insert/update
CREATE OR REPLACE FUNCTION encrypt_integration_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only encrypt if the token looks unencrypted (not base64)
  -- This prevents double encryption on updates
  IF NEW.access_token IS NOT NULL AND NEW.access_token !~ '^[A-Za-z0-9+/]+=*$' THEN
    NEW.access_token := encrypt_token(NEW.access_token);
  END IF;
  
  IF NEW.refresh_token IS NOT NULL AND NEW.refresh_token !~ '^[A-Za-z0-9+/]+=*$' THEN
    NEW.refresh_token := encrypt_token(NEW.refresh_token);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to encrypt tokens before insert or update
DROP TRIGGER IF EXISTS encrypt_tokens_trigger ON public.integrations;
CREATE TRIGGER encrypt_tokens_trigger
  BEFORE INSERT OR UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_integration_tokens();

-- Add comment to document the encryption
COMMENT ON COLUMN public.integrations.access_token IS 'Encrypted access token - use user_integrations_decrypted view or decrypt_token() to read';
COMMENT ON COLUMN public.integrations.refresh_token IS 'Encrypted refresh token - use user_integrations_decrypted view or decrypt_token() to read';