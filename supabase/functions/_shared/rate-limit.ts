import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier: string; // user_id, ip, or custom identifier
}

export class RateLimiter {
  private supabase: any;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - this.config.windowMs);
    
    // Create a unique key for this rate limit
    const rateLimitKey = `${this.config.identifier}:${identifier}`;
    
    // Get recent requests from a rate_limits table (you'll need to create this)
    const { data: recentRequests, error } = await this.supabase
      .from("edge_function_rate_limits")
      .select("id")
      .eq("key", rateLimitKey)
      .gte("created_at", windowStart.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Rate limit check error:", error);
      // On error, allow the request but log it
      return { allowed: true, remaining: this.config.maxRequests, resetAt: new Date(now.getTime() + this.config.windowMs) };
    }

    const requestCount = recentRequests?.length || 0;
    const allowed = requestCount < this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - requestCount);
    const resetAt = new Date(windowStart.getTime() + this.config.windowMs);

    if (allowed) {
      // Record this request
      await this.supabase
        .from("edge_function_rate_limits")
        .insert({ key: rateLimitKey });
      
      // Clean up old entries (optional, can be done via a scheduled job instead)
      await this.supabase
        .from("edge_function_rate_limits")
        .delete()
        .lt("created_at", windowStart.toISOString())
        .eq("key", rateLimitKey);
    }

    return { allowed, remaining, resetAt };
  }
}

// Helper function to extract client IP from request
export const getClientIp = (request: Request): string => {
  // Try various headers that might contain the real IP
  const headers = [
    "x-real-ip",
    "x-forwarded-for",
    "cf-connecting-ip", // Cloudflare
    "x-client-ip",
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for may contain multiple IPs
      return value.split(",")[0].trim();
    }
  }

  // Fallback - this might not be the real client IP in production
  return "unknown";
};

// Convenience function for common rate limiting scenarios
export const checkRateLimit = async (
  request: Request,
  userId?: string,
  config?: Partial<RateLimitConfig>
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> => {
  const identifier = userId || getClientIp(request);
  
  const rateLimiter = new RateLimiter({
    maxRequests: config?.maxRequests || 100,
    windowMs: config?.windowMs || 60 * 60 * 1000, // 1 hour default
    identifier: config?.identifier || "api",
  });

  return rateLimiter.checkLimit(identifier);
};