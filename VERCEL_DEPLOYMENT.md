# Vercel Deployment Guide

## Fix: Missing Supabase Environment Variables

The build is failing because Supabase environment variables are not set in Vercel.

### Solution: Add Environment Variables in Vercel

1. **Go to your Vercel project dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your project: `united4contactsolutions`

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add these 3 environment variables:**

   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```
   Value: `https://vzhfnhbftlgngsdxyvgi.supabase.co`

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aGZuaGJmdGxnbmdzZHh5dmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NDUyMjQsImV4cCI6MjA4MDEyMTIyNH0.jWs_wSg4jRNKvzludF8VeHcYQ9onXEJnrwuyiCvwsLk`

   ```
   SUPABASE_SERVICE_ROLE_KEY
   ```
   Value: (Get this from Supabase dashboard → Settings → API → service_role key)

4. **Set Environment for each variable:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
   (Check all three)

5. **Redeploy**
   - After adding variables, go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**

### Quick Steps:

1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add the 3 variables above
4. Redeploy

### Important Notes:

- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for anon key)
- `SUPABASE_SERVICE_ROLE_KEY` is **secret** - never expose it publicly
- After adding variables, you **must redeploy** for them to take effect
- Variables are available during build time and runtime

### Verify It Works:

After redeploying, check:
1. Build should complete successfully
2. Landing page should load content from Supabase
3. Admin dashboard should be able to save content

