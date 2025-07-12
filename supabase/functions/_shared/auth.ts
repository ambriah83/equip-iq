import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export const getAuthenticatedUser = async (request: Request) => {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    throw new Error("No authorization header provided");
  }

  const token = authHeader.replace("Bearer ", "");
  
  if (!token) {
    throw new Error("No bearer token provided");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration");
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error(`Authentication failed: ${error?.message || "Invalid token"}`);
  }

  return { user, supabase };
};

export const requireAuth = async (request: Request) => {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);
    return { user, supabase };
  } catch (error) {
    throw new Error(`Authentication required: ${error.message}`);
  }
};