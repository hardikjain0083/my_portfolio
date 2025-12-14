# Vercel Deployment Guide

This guide explains how to deploy your frontend to Vercel and connect it to your HuggingFace backend.

## ✅ What Has Been Updated

1. **Backend URL Updated**: The default API URL in `Chatbot.tsx` has been changed to `https://hardikjain0083-myportfolio.hf.space`
2. **Vercel Configuration**: Created `vercel.json` for proper Vercel deployment settings

## 🚀 Deployment Steps

### Step 1: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://hardikjain0083-myportfolio.hf.space`
   - **Environment**: Select all (Production, Preview, Development)

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

#### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect the Vite configuration
4. Make sure the **Root Directory** is set to `frontend` (or adjust build settings)
5. Add the environment variable as described in Step 1
6. Deploy!

### Step 3: Verify Backend Connection

After deployment, test the chatbot:
1. Open your deployed Vercel URL
2. Click the chat button (bottom-right)
3. Send a test message
4. Check the browser console (F12) for any CORS or connection errors

## 🔧 Important Configuration Details

### Backend API Endpoint
- **Base URL**: `https://hardikjain0083-myportfolio.hf.space`
- **Chat Endpoint**: `/api/chat`
- **Health Check**: `/api/health` (optional, for testing)

### CORS Configuration
Your HuggingFace backend should already have CORS configured to allow requests from your Vercel domain. The backend's `app.py` includes:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

If you encounter CORS errors, you may need to update the backend to specifically allow your Vercel domain:
```python
allow_origins=[
    "https://your-vercel-app.vercel.app",
    "https://your-custom-domain.com"
]
```

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or CORS errors
**Solution**: 
- Verify the backend URL is correct in Vercel environment variables
- Check that the HuggingFace backend is running and accessible
- Test the backend directly: `https://hardikjain0083-myportfolio.hf.space/api/health`
- Ensure CORS is properly configured on the backend

### Issue: Environment variable not working
**Solution**:
- Make sure the variable name is exactly `VITE_API_URL` (Vite requires the `VITE_` prefix)
- Redeploy after adding/updating environment variables
- Check that the variable is set for the correct environment (Production/Preview/Development)

### Issue: Build fails on Vercel
**Solution**:
- Ensure `vercel.json` is in the project root
- Check that the build command in `package.json` is correct
- Verify all dependencies are listed in `package.json`

### Issue: Chatbot not responding
**Solution**:
- Open browser DevTools (F12) and check the Console tab for errors
- Verify the API endpoint is correct: `${API_BASE_URL}/api/chat`
- Test the backend directly using curl or Postman:
  ```bash
  curl -X POST https://hardikjain0083-myportfolio.hf.space/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello"}'
  ```

## 📝 Local Development

For local development, you can override the API URL:

1. Create a `.env.local` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

2. The `.env.local` file is gitignored and will override the default for local development

## 🔐 Security Notes

- The backend URL is now public in the code (as default fallback)
- For production, always use environment variables in Vercel
- The backend should validate and sanitize all incoming requests
- Consider adding rate limiting on the backend for production use

## 📚 Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [HuggingFace Spaces Documentation](https://huggingface.co/docs/hub/spaces)

