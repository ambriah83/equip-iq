
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { style = 'modern', colors = 'blue and teal', concept = 'equipment management' } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Define different logo prompts based on concept and style
    const logoPrompts = [
      `Professional logo for "EquipIQ" - ${concept} platform, ${style} design with ${colors} colors, gear and brain fusion icon, clean minimalist style, transparent background, high quality vector style`,
      `Modern logo for "EquipIQ" - smart equipment monitoring system, ${style} aesthetic with ${colors} palette, circuit board and wrench combination, tech startup vibe, transparent background, professional vector design`,
      `Clean logo for "EquipIQ" - AI-powered maintenance platform, ${style} style using ${colors}, dashboard and equipment symbols, corporate tech look, transparent background, scalable vector format`,
      `Sleek logo for "EquipIQ" - intelligent equipment management, ${style} design in ${colors}, mechanical gear with digital elements, SaaS company branding, transparent background, premium vector quality`
    ];

    const logoResults = [];

    for (let i = 0; i < logoPrompts.length; i++) {
      try {
        console.log(`Generating logo ${i + 1}/4 with prompt:`, logoPrompts[i]);
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: logoPrompts[i],
            size: '1024x1024',
            quality: 'high',
            output_format: 'png',
            background: 'transparent',
            n: 1
          }),
        });

        if (!response.ok) {
          console.error(`Failed to generate logo ${i + 1}:`, await response.text());
          continue;
        }

        const data = await response.json();
        
        if (data.data && data.data[0] && data.data[0].b64_json) {
          logoResults.push({
            id: i + 1,
            prompt: logoPrompts[i],
            image: `data:image/png;base64,${data.data[0].b64_json}`,
            style: style,
            concept: concept,
            colors: colors
          });
        }
      } catch (error) {
        console.error(`Error generating logo ${i + 1}:`, error);
      }
    }

    if (logoResults.length === 0) {
      throw new Error('Failed to generate any logos');
    }

    console.log(`Successfully generated ${logoResults.length} logos`);

    return new Response(JSON.stringify({ 
      success: true, 
      logos: logoResults,
      count: logoResults.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-logo function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
