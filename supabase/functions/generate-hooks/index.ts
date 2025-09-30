import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();

    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestBody = { topic };
    console.log('Generating hooks for topic:', topic);
    console.log('Sending request to webhook with body:', JSON.stringify(requestBody));

    // Call the external webhook API
    const webhookResponse = await fetch('https://kuts.air2.top/webhook/hook-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    console.log('Webhook response status:', webhookResponse.status);
    
    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('Webhook error response:', errorText);
      throw new Error(`Webhook responded with status: ${webhookResponse.status}, body: ${errorText}`);
    }

    const data = await webhookResponse.json();
    console.log('Webhook response:', data);

    // Parse the response format: { "output": { "hook1": "...", "hook2": "...", ... } }
    if (!data?.output) {
      throw new Error('Invalid response format from webhook');
    }

    const output = data.output;
    const hooks = [
      output.hook1,
      output.hook2,
      output.hook3,
      output.hook4,
    ];

    // Validate that all hooks are present
    if (hooks.some(hook => !hook)) {
      throw new Error('Some hooks are missing in the response');
    }

    console.log('Successfully generated hooks:', hooks.length);

    return new Response(
      JSON.stringify({ hooks }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-hooks function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate hooks' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
