
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, csvData, dataType, requiredFields, fieldDescriptions } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let messages;
    
    if (csvData) {
      // Process CSV data with AI for intelligent mapping
      messages = [
        {
          role: 'system',
          content: `You are an expert at processing and mapping CSV data. The user has provided CSV data that needs to be converted to match specific field requirements for importing ${dataType}.

Required fields: ${requiredFields.join(', ')}
Field descriptions: ${Object.entries(fieldDescriptions).map(([key, desc]) => `${key}: ${desc}`).join(', ')}

Your task is to:
1. Analyze the provided CSV data and understand its structure
2. Intelligently map the existing columns to the required fields
3. Handle variations in column names (e.g., "Store Name" -> "name", "Location Code" -> "abbreviation")
4. Fill in missing required fields with reasonable defaults where possible
5. Return ONLY valid CSV data with the correct headers as the first row
6. Ensure all required fields are present and properly mapped

Be smart about column mapping - look for semantic similarities, not just exact matches.`
        },
        {
          role: 'user',
          content: `Please process this CSV data and map it to the required ${dataType} format:

${csvData}

Required fields: ${requiredFields.join(', ')}
Make sure to intelligently map the columns and include all required fields.`
        }
      ];
    } else if (imageData) {
      // Process image data as before
      messages = [
        {
          role: 'system',
          content: `You are an expert at extracting structured data from images. The user will provide an image containing tabular data for importing ${dataType}. 

Required fields: ${requiredFields.join(', ')}

Your task is to:
1. Analyze the image and identify any tabular data
2. Extract the data and convert it to CSV format
3. Ensure all required fields are present and properly mapped
4. Return ONLY valid CSV data with headers as the first row
5. If the image doesn't contain tabular data or is unclear, explain what you see instead

Be very careful about data accuracy. If you're unsure about any values, indicate this in your response.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please extract the ${dataType} data from this image and convert it to CSV format. Make sure to include the required fields: ${requiredFields.join(', ')}`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ];
    } else {
      throw new Error('Either imageData or csvData must be provided');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const extractedText = data.choices[0].message.content;

    // Check if the response looks like CSV data
    const lines = extractedText.trim().split('\n');
    const isCSV = lines.length > 1 && lines[0].includes(',');

    return new Response(JSON.stringify({
      success: isCSV,
      csvData: isCSV ? extractedText : null,
      message: isCSV ? 'Data processed successfully' : extractedText,
      extractedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing data:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
