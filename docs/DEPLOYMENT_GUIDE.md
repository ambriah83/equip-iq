
# Deployment Guide

## Production Deployment Overview

Operations Hub is designed for static hosting with Supabase backend integration. The application builds to static files that can be deployed to any CDN or static hosting service.

## Build Configuration

### **Environment Variables**
```bash
# Production Environment (.env.production)
VITE_APP_TITLE="Operations Hub"
VITE_APP_DESCRIPTION="AI-powered equipment management system"

# Supabase Configuration (hardcoded in client)
SUPABASE_URL=https://gynvafivzdtdqojuuoit.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Vite Build Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true
  }
});
```

## Hosting Platforms

### **Vercel Deployment (Recommended)**
```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Deployment Steps:**
1. Connect GitHub repository to Vercel
2. Configure build settings (auto-detected for Vite)
3. Set environment variables in Vercel dashboard
4. Deploy automatically on git push

### **Netlify Deployment**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### **AWS S3 + CloudFront**
```bash
# Build and deploy script
#!/bin/bash
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Supabase Backend Configuration

### **Database Migrations**
```sql
-- Ensure all tables have proper RLS policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create production-ready policies
CREATE POLICY "authenticated_access" ON locations
  FOR ALL USING (auth.role() = 'authenticated');

-- Set up proper indexes for performance
CREATE INDEX CONCURRENTLY idx_equipment_location_status 
  ON equipment(location_id, status);
CREATE INDEX CONCURRENTLY idx_equipment_logs_equipment_date 
  ON equipment_logs(equipment_id, created_at DESC);
```

### **Edge Functions Deployment**
```typescript
// supabase/functions/extract-data-from-image/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    // Process image with AI service
    const extractedData = await processImageWithAI(image);
    
    return new Response(
      JSON.stringify({ data: extractedData }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
```

**Deploy Edge Functions:**
```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy extract-data-from-image
```

### **Secrets Configuration**
```bash
# Set production secrets
supabase secrets set OPENAI_API_KEY=your-openai-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Verify secrets
supabase secrets list
```

## Performance Optimization

### **Build Optimization**
```json
// package.json build scripts
{
  "scripts": {
    "build": "tsc && vite build",
    "build:analyze": "npm run build && npx vite-bundle-analyzer dist/stats.html",
    "preview": "vite preview --port 5173"
  }
}
```

### **CDN Configuration**
```typescript
// Static asset optimization
const assetConfig = {
  // Cache static assets for 1 year
  '*.js': 'public, max-age=31536000, immutable',
  '*.css': 'public, max-age=31536000, immutable',
  '*.png': 'public, max-age=31536000, immutable',
  '*.jpg': 'public, max-age=31536000, immutable',
  '*.svg': 'public, max-age=31536000, immutable',
  
  // Cache HTML for 1 hour
  '*.html': 'public, max-age=3600',
  
  // Don't cache service worker
  'sw.js': 'no-cache'
};
```

### **Image Optimization**
```typescript
// Optimize images during build
const imageOptimization = {
  webp: {
    quality: 80,
    effort: 6
  },
  jpeg: {
    quality: 80,
    progressive: true
  },
  png: {
    compressionLevel: 9
  }
};
```

## Monitoring & Analytics

### **Error Tracking**
```typescript
// Error boundary with reporting
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to monitoring service
    if (process.env.NODE_ENV === 'production') {
      reportError(error, {
        ...errorInfo,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
  }
}
```

### **Performance Monitoring**
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    gtag('event', 'web_vitals', {
      name: metric.name,
      value: Math.round(metric.value),
      event_label: metric.id,
    });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### **Database Performance Monitoring**
```sql
-- Monitor slow queries
SELECT 
  query,
  mean_exec_time,
  calls,
  total_exec_time,
  rows,
  mean_exec_time/calls as avg_time_per_call
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_total_relation_size(schemaname||'.'||tablename) as raw_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY raw_size DESC;
```

## Security Configuration

### **Content Security Policy**
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://gynvafivzdtdqojuuoit.supabase.co wss://gynvafivzdtdqojuuoit.supabase.co;
  font-src 'self';
  frame-src 'none';
  object-src 'none';
">
```

### **HTTPS Configuration**
```bash
# Force HTTPS redirect (handled by hosting platform)
# Ensure all API calls use HTTPS
# Set secure cookie flags in production
```

## Backup & Recovery

### **Database Backup Strategy**
```bash
# Automated daily backups (Supabase handles this)
# Point-in-time recovery available for 7 days
# Download manual backups for critical changes

# Manual backup before major deployments
supabase db dump --data-only > backup-$(date +%Y%m%d).sql
```

### **Disaster Recovery Plan**
1. **Database Recovery**: Use Supabase point-in-time recovery
2. **Application Recovery**: Redeploy from Git repository
3. **User Data**: Restore from automated backups
4. **Configuration**: Environment variables in hosting platform

## Deployment Checklist

### **Pre-Deployment**
- [ ] Run type checking: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] Build successfully: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Check bundle size: `npm run build:analyze`

### **Database Preparation**
- [ ] Run pending migrations
- [ ] Update RLS policies if needed
- [ ] Deploy edge functions
- [ ] Update secrets
- [ ] Test database connections

### **Production Deployment**
- [ ] Deploy to staging environment first
- [ ] Smoke test critical features
- [ ] Deploy to production
- [ ] Verify deployment health
- [ ] Monitor error rates
- [ ] Check performance metrics

### **Post-Deployment**
- [ ] Verify all features working
- [ ] Check monitoring dashboards
- [ ] Update documentation
- [ ] Notify team of deployment
- [ ] Monitor for 24 hours

This deployment guide ensures a smooth, secure, and monitored production deployment of Operations Hub.
