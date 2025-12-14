# Deployment Guide

This guide outlines the steps to deploy your Portfolio Website (Frontend) to Vercel and your RAG Chatbot (Backend) to Hugging Face Spaces.

## Prerequisites
- A GitHub account.
- A Vercel account (linked to GitHub).
- A Hugging Face account.
- A Groq API Key (for the chatbot).

---

## Part 1: Backend Deployment (Hugging Face Spaces)

1.  **Create a New Space:**
    - Go to [Hugging Face Spaces](https://huggingface.co/spaces).
    - Click **"Create new Space"**.
    - **Space Name:** e.g., `my-portfolio-rag`.
    - **License:** MIT (or your choice).
    - **SDK:** Select **Docker**.
    - **Visibility:** Public.
    - Click **"Create Space"**.

2.  **Upload Files:**
    - You can upload files via the Web UI or using Git.
    - **Required Files/Folders:**
        - `app.py`
        - `Dockerfile`
        - `requirements.txt`
        - `db/` (The entire folder containing your vector database)
        - `docs/` (Optional, but good for reference)
    - **Note:** Ensure you do NOT upload `venv` or `__pycache__` folders (we already cleaned these up locally).

3.  **Set Environment Variables:**
    - Go to the **Settings** tab of your Space.
    - Scroll to **"Variables and secrets"**.
    - Click **"New secret"**.
    - **Name:** `GROQ_API_KEY`
    - **Value:** Your actual Groq API Key.
    - Click **Save**.

4.  **Verify Deployment:**
    - The Space will start building.
    - Once "Running", you will see your API documentation or a "Running" status.
    - **Copy the Direct URL:** It usually looks like `https://username-space-name.hf.space`. You can find this by clicking the "Embed this space" button or looking at the URL bar (append `/api/chat` to test manually if needed, but we just need the base URL).
    - **Example Base URL:** `https://hardikjain0083-my-portfolio-rag.hf.space` (Note: It must be `https`).

---

## Part 2: Frontend Deployment (Vercel)

1.  **Push Code to GitHub:**
    - Ensure your project is pushed to a GitHub repository.
    - If you haven't already:
        ```bash
        git init
        git add .
        git commit -m "Ready for deployment"
        git branch -M main
        git remote add origin <your-repo-url>
        git push -u origin main
        ```

2.  **Import to Vercel:**
    - Go to [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **"Add New..."** -> **"Project"**.
    - Import your GitHub repository.

3.  **Configure Project:**
    - **Framework Preset:** Vite (should be detected automatically).
    - **Root Directory:** Click "Edit" and select `frontend`. **(Crucial Step)**.
    - **Build Command:** `npm run build` (default is fine).
    - **Output Directory:** `dist` (default is fine).
    - **Install Command:** `npm install` (default is fine).

4.  **Set Environment Variables:**
    - Expand the **"Environment Variables"** section.
    - **Key:** `VITE_API_URL`
    - **Value:** The URL of your Hugging Face Space (from Part 1).
        - Example: `https://hardikjain0083-my-portfolio-rag.hf.space`
        - **Important:** Do NOT add a trailing slash `/`.
    - Click **Add**.

5.  **Deploy:**
    - Click **"Deploy"**.
    - Vercel will build your frontend.
    - Once complete, you will get a live URL for your portfolio!

---

## Troubleshooting

-   **Chatbot not responding?**
    -   Check the Console in your browser (F12 -> Console) for errors.
    -   Verify the `VITE_API_URL` in Vercel settings is correct and has no trailing slash.
    -   Check the Logs in your Hugging Face Space to see if the backend is receiving requests or crashing.
    -   Ensure `GROQ_API_KEY` is set correctly in Hugging Face Secrets.

-   **CORS Errors?**
    -   The backend is configured to allow all origins (`allow_origins=["*"]`), so this should not happen. If it does, check the Network tab in browser dev tools.
