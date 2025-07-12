import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";
import { validateRequired, validateString, validateImageData, validateRequestSize, validateArray, validateEnum } from "../_shared/validation.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    // Check request size (10MB max)
    await validateRequestSize(req, 10);

    // Require authentication
    const { user } = await requireAuth(req);

    // Rate limiting - 20 requests per hour per user for this expensive operation
    const rateLimitResult = await checkRateLimit(req, user.id, {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      identifier: "extract-data-from-image"
    });

    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        success: false,
        error: "Rate limit exceeded. Please try again later.",
        remaining: rateLimitResult.remaining,
        resetAt: rateLimitResult.resetAt
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString()
        },
      });
    }

    const requestData = await req.json();
    const { imageData, csvData, dataType, requiredFields, fieldDescriptions } = requestData;

    // Validate inputs
    if (!imageData && !csvData) {
      throw new Error('Either imageData or csvData must be provided');
    }

    if (imageData && csvData) {
      throw new Error('Provide either imageData or csvData, not both');
    }

    // Validate common fields
    validateRequired(dataType, "dataType");
    validateString(dataType, "dataType", 1, 100);
    validateRequired(requiredFields, "requiredFields");
    validateArray(requiredFields, "requiredFields", 1, 50);
    
    // Validate each required field
    requiredFields.forEach((field: any, index: number) => {
      validateString(field, `requiredFields[${index}]`, 1, 100);
    });

    // Validate field descriptions if provided
    if (fieldDescriptions) {
      const keys = Object.keys(fieldDescriptions);
      if (keys.length > 50) {
        throw new Error("fieldDescriptions cannot contain more than 50 fields");
      }
      keys.forEach(key => {
        validateString(key, `fieldDescriptions key`, 1, 100);
        validateString(fieldDescriptions[key], `fieldDescriptions['${key}']`, 1, 500);
      });
    }

    // Validate image data if provided
    if (imageData) {
      validateImageData(imageData, 10); // 10MB max for images
    }

    // Validate CSV data if provided
    if (csvData) {
      validateString(csvData, "csvData", 1, 1000000); // 1MB max for CSV
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Log the request (without sensitive data)
    console.log(`User ${user.id} requesting data extraction for ${dataType}`);

    let messages;
    
    if (csvData) {
      // Process CSV data with AI for intelligent mapping
      messages = [
        {
          role: 'system',
          content: `You are an expert at processing and mapping CSV data. The user has provided CSV data that needs to be converted to match specific field requirements for importing ${dataType}.

Required fields: ${requiredFields.join(', ')}
Field descriptions: ${fieldDescriptions ? Object.entries(fieldDescriptions).map(([key, desc]) => `${key}: ${desc}`).join(', ') : 'Not provided'}

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
      // Process image data
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
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
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
      extractedText,
      remaining: rateLimitResult.remaining - 1
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(),
        'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString()
      },
    });

  } catch (error) {
    console.error('Error processing data:', error);
    
    const status = error.message.includes('Authentication') ? 401 : 
                   error.message.includes('Rate limit') ? 429 : 400;
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});