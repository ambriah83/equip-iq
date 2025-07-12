export const getAllowedOrigins = () => {
  const env = Deno.env.get("ENVIRONMENT") || "development";
  
  // Define allowed origins based on environment
  const allowedOrigins = {
    production: [
      "https://equip-iq.com",
      "https://www.equip-iq.com",
      // Add your production domains here
    ],
    development: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ],
  };

  return env === "production" ? allowedOrigins.production : [...allowedOrigins.production, ...allowedOrigins.development];
};

export const getCorsHeaders = (request: Request) => {
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = getAllowedOrigins();
  
  // Check if the origin is allowed
  const isAllowed = allowedOrigins.includes(origin);
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Max-Age": "86400", // 24 hours
  };
};

export const handleCors = (request: Request) => {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  }
  
  return null;
};