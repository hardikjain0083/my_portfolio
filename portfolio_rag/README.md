# Portfolio RAG Chatbot

An interactive RAG (Retrieval-Augmented Generation) chatbot that answers questions based on your portfolio documents using ChromaDB for vector storage and Groq's LLM for generation.

## Features

- 📚 Document ingestion and vectorization
- 🔍 Semantic search using ChromaDB
- 💬 Interactive web-based chat interface
- 🤖 Powered by Groq's Llama 3.1 8B Instant model
- 🎨 Modern, responsive UI

## Setup

### 1. Activate Virtual Environment (Recommended)

If you have a virtual environment, activate it first:

**Windows:**
```bash
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note:** If you encounter compatibility issues, make sure you're using Python 3.11 or 3.12. Python 3.14 may have compatibility issues with some packages.

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

You can get your Groq API key from [https://console.groq.com/](https://console.groq.com/)

### 4. Ingest Documents

Place your `.txt` files in the `docs/` directory, then run:

```bash
python ingestion_pipeline.py
```

This will:
- Load all `.txt` files from the `docs/` directory
- Split them into chunks
- Create embeddings and store them in ChromaDB

### 5. Run the Application

Start the FastAPI server:

```bash
python app.py
```

Or using uvicorn directly:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 6. Access the Chatbot

Open your browser and navigate to:

```
http://localhost:8000
```

## Project Structure

```
portfolio_rag/
├── app.py                 # FastAPI backend server
├── index.html             # Frontend chat interface
├── ingestion_pipeline.py  # Document ingestion script
├── retrieval_pipeline.py  # RAG retrieval logic
├── requirements.txt       # Python dependencies
├── docs/                  # Place your .txt documents here
└── db/                    # ChromaDB storage (auto-generated)
```

## Usage

1. **Add Documents**: Place your portfolio documents (`.txt` files) in the `docs/` directory
2. **Ingest**: Run `python ingestion_pipeline.py` to process and index the documents
3. **Start Server**: Run `python app.py` to start the web server
4. **Chat**: Open `http://localhost:8000` in your browser and start asking questions!

## API Endpoints

- `GET /` - Serves the frontend HTML
- `POST /api/chat` - Chat endpoint
  - Request: `{"message": "your question"}`
  - Response: `{"answer": "response text", "sources": ["source1.txt", "source2.txt"]}`
- `GET /api/health` - Health check endpoint

## Technologies

- **Backend**: FastAPI, Python
- **Frontend**: HTML, CSS, JavaScript
- **Vector DB**: ChromaDB
- **Embeddings**: HuggingFace (all-MiniLM-L6-v2)
- **LLM**: Groq (Llama 3.1 8B Instant)
- **Framework**: LangChain

## Notes

- The chatbot only answers based on the provided context from your documents
- If the answer is not in the context, it will inform you accordingly
- Documents are chunked with a size of 1000 characters and no overlap
- The retriever uses similarity search with a threshold of 0.3

