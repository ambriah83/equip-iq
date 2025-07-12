# Supabase Edge Functions Security Updates

## Overview
This document outlines the security improvements made to your Supabase Edge Functions.

## Changes Implemented

### 1. **Shared Security Utilities** ✅
Created shared modules in `supabase/functions/_shared/`:
- `cors.ts` - Proper CORS configuration with domain whitelisting
- `auth.ts` - Authentication utilities using service role key
- `validation.ts` - Input validation functions
- `rate-limit.ts` - Rate limiting to prevent abuse

### 2. **Database Changes** ✅
- Added `edge_function_rate_limits` table for rate limiting (migration: `20250112_add_rate_limiting.sql`)

### 3. **Updated Functions** ✅
- **extract-data-from-image**: Added authentication, rate limiting (20 req/hour), input validation
- **create-checkout**: Now uses service role key, added rate limiting (10 req/hour), proper validation

## Remaining Functions to Update

Apply similar security updates to these functions:

### **check-subscription**
```typescript
// Add these imports
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";

// Replace corsHeaders constant with dynamic CORS
// Add authentication check
// Add rate limiting (100 req/hour recommended)
```

### **customer-portal**
```typescript
// Add authentication
// Add rate limiting (20 req/hour)
// Validate all inputs
// Use proper CORS
```

### **send-invitation**
```typescript
// Critical: Add rate limiting (5 req/hour) to prevent spam
// Validate email format
// Add authentication
// Check user permissions before sending invites
```

### **setup-location-payment**
```typescript
// Add authentication
// Validate location_id as UUID
// Add rate limiting (10 req/hour)
// Use proper CORS
```

### **stripe-webhook**
```typescript
// Keep webhook signature validation (already good!)
// Update CORS to restrict to Stripe IPs only
// Consider adding webhook event deduplication
```

## Security Best Practices Checklist

For each Edge Function:

- [ ] Import and use shared CORS configuration
- [ ] Require authentication (except webhooks)
- [ ] Add appropriate rate limiting
- [ ] Validate ALL inputs
- [ ] Use service role key for Supabase operations
- [ ] Handle errors properly (don't expose internal details)
- [ ] Log security-relevant events
- [ ] Set appropriate HTTP status codes

## Environment Variables Required

Ensure these are set in your Supabase project:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `ENVIRONMENT` (set to "production" in prod)

## Testing

After updates:
1. Test CORS by making requests from unauthorized domains
2. Test rate limiting by exceeding limits
3. Test authentication with invalid/missing tokens
4. Test input validation with malformed data
5. Verify error messages don't leak sensitive info

## Production Deployment

1. Run the migration to create rate limit table
2. Deploy updated Edge Functions
3. Update ENVIRONMENT variable to "production"
4. Add your production domain to CORS allowed origins in `_shared/cors.ts`
5. Monitor logs for any security-related errors

## Monitoring

Set up alerts for:
- Authentication failures
- Rate limit violations
- Invalid input attempts
- Unexpected errors in Edge Functions

This will help identify potential security threats early.