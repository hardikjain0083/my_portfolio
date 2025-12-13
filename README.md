# Portfolio Frontend with RAG Chatbot

This project consists of a React frontend portfolio website integrated with a RAG (Retrieval-Augmented Generation) chatbot backend. The chatbot is powered by ChromaDB for vector storage and Groq's LLM for generating responses based on your portfolio documents.

## Project Structure

```
portfolio_frontend/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Chatbot.tsx  # Chatbot component (connected to backend)
│   │   └── ...
│   └── package.json
└── portfolio_rag/         # FastAPI backend with RAG chatbot
    ├── app.py             # FastAPI server
    ├── ingestion_pipeline.py
    ├── requirements.txt
    └── docs/              # Portfolio documents
```

## Prerequisites

- **Node.js** (v18 or higher) and npm
- **Python** (3.11 or 3.12 recommended)
- **Groq API Key** - Get one from [https://console.groq.com/](https://console.groq.com/)

## Setup Instructions

### Step 1: Backend Setup (Portfolio RAG)

1. **Navigate to the backend directory:**
   ```bash
   cd portfolio_rag
   ```

2. **Activate virtual environment (if using one):**
   
   **Windows:**
   ```bash
   .\venv\Scripts\activate
   ```
   
   **Linux/Mac:**
   ```bash
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create a `.env` file in the `portfolio_rag` directory:**
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. **Ingest your portfolio documents:**
   - Place your `.txt` files in the `portfolio_rag/docs/` directory
   - Run the ingestion pipeline:
     ```bash
     python ingestion_pipeline.py
     ```

### Step 2: Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Optional: Configure API URL**
   
   If your backend is running on a different URL, create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   
   By default, the frontend will connect to `http://localhost:8000`.

## Running the Project

### Step 1: Start the Backend Server

1. **Navigate to the backend directory:**
   ```bash
   cd portfolio_rag
   ```

2. **Activate virtual environment (if using one):**
   
   **Windows:**
   ```bash
   .\venv\Scripts\activate
   ```
   
   **Linux/Mac:**
   ```bash
   source venv/bin/activate
   ```

3. **Start the FastAPI server:**
   ```bash
   python app.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be running at `http://localhost:8000`

### Step 2: Start the Frontend Development Server

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:8080` (or the port shown in the terminal)

### Step 3: Access the Application

1. Open your browser and navigate to `http://localhost:8080` (or the port shown in your terminal)
2. Click on the chat button (bottom-right corner) to open the chatbot
3. Start asking questions about your portfolio!

## API Endpoints

The backend provides the following endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/chat` - Chat endpoint
  - Request body: `{"message": "your question"}`
  - Response: `{"answer": "response text", "sources": ["source1.txt", "source2.txt"]}`

## Troubleshooting

### Backend Issues

- **"GROQ_API_KEY environment variable is not set"**
  - Make sure you've created a `.env` file in the `portfolio_rag` directory with your Groq API key

- **"No module named 'fastapi'" or similar import errors**
  - Make sure you've activated your virtual environment and installed all dependencies with `pip install -r requirements.txt`

- **Port 8000 already in use**
  - Change the port in `app.py` or kill the process using port 8000

### Frontend Issues

- **"Failed to fetch" or connection errors**
  - Make sure the backend is running on `http://localhost:8000`
  - Check that CORS is properly configured (it should be enabled by default)
  - Verify the API URL in your frontend `.env` file if you've customized it

- **"Cannot find module" errors**
  - Run `npm install` in the frontend directory to install all dependencies

### Chatbot Not Responding

- Check the browser console for error messages
- Verify the backend is running and accessible at `http://localhost:8000`
- Test the backend directly by visiting `http://localhost:8000/api/health` in your browser
- Check that documents have been ingested (run `python ingestion_pipeline.py` if needed)

## Development Notes

- The chatbot component is located at `frontend/src/components/Chatbot.tsx`
- The backend API is configured in `portfolio_rag/app.py`
- The frontend connects to the backend via the `/api/chat` endpoint
- All other frontend logic remains unchanged - only the chatbot integration was updated

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

### Backend
- FastAPI
- ChromaDB (vector database)
- LangChain
- HuggingFace Embeddings
- Groq LLM (Llama 3.1 8B Instant)

## License

This project is for personal portfolio use.

