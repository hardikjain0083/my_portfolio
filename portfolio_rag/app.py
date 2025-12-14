import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = FastAPI(title="Portfolio RAG Chatbot API")

# -----------------------------
# 1. CORS Configuration (Crucial for Vercel)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (including your Vercel app)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# 2. Load Vector Store (With Safety Check)
# -----------------------------
def find_persist_directory():
    """
    Dynamically find the directory containing chroma.sqlite3.
    This handles cases where the user uploaded 'db' folder, 'chroma_db' folder, 
    or just the files to the root.
    """
    possible_paths = [
        "db/chroma_db",
        "chroma_db",
        ".",
        "db"
    ]
    
    for path in possible_paths:
        if os.path.exists(os.path.join(path, "chroma.sqlite3")):
            print(f"Found database in: {path}")
            return path
            
    return None

PERSIST_DIRECTORY = find_persist_directory()

if not PERSIST_DIRECTORY:
    print("CRITICAL WARNING: Could not find 'chroma.sqlite3' in any expected directory.")
    print("Please ensure you uploaded the 'db' folder or 'chroma_db' folder correctly.")
    # Fallback to default to prevent immediate crash, though it will be empty
    PERSIST_DIRECTORY = "db/chroma_db"

print("Loading embedding model...")
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

print(f"Loading vector database from {PERSIST_DIRECTORY}...")
try:
    db = Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embedding_model,
        collection_metadata={"hnsw:space": "cosine"}
    )
    
    # Check if DB is empty
    count = db._collection.count()
    print(f"Vector database loaded with {count} documents.")

    # Initialize retriever with lower threshold
    retriever = db.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={
            "k": 5,
            "score_threshold": 0.2  # Lowered from 0.3 to catch more relevant chunks
        }
    )
except Exception as e:
    print(f"Error loading vector database: {e}")
    db = None
    retriever = None

# -----------------------------
# 3. Groq LLM Client
# -----------------------------
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    print("WARNING: GROQ_API_KEY not set in environment variables.")

client = Groq(api_key=groq_api_key)

# -----------------------------
# Request/Response Models
# -----------------------------
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]

# -----------------------------
# Helper Functions
# -----------------------------
def generate_answer(context: str, query: str) -> str:
    """Generate answer using Groq LLM"""
    if not client.api_key:
        return "Error: LLM API Key is missing on the server."

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a RAG-based portfolio assistant. "
                        "Answer ONLY using the provided context. "
                        "If the answer is not in the context, say "
                        "'I don't have enough information based on the provided documents.'"
                    )
                },
                {
                    "role": "user",
                    "content": f"Context:\n{context}\n\nQuestion:\n{query}"
                }
            ],
            temperature=0.2
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating answer: {str(e)}"

# -----------------------------
# API Endpoints
# -----------------------------

@app.get("/")
async def root():
    """Health check endpoint for Vercel/Render"""
    return {
        "status": "running", 
        "message": "Portfolio RAG Backend is active. Connect this URL to your Vercel frontend."
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handle chat requests"""
    try:
        query = request.message.strip()
        
        if not query:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if not retriever:
            raise HTTPException(status_code=500, detail="Vector database is not initialized.")

        # Retrieve relevant documents
        try:
            relevant_docs = retriever.invoke(query)
        except Exception as e:
            print(f"Retriever error: {e}")
            return ChatResponse(answer="Error retrieving documents.", sources=[])
        
        if not relevant_docs:
            return ChatResponse(
                answer="I don't have enough information based on the provided documents.",
                sources=[]
            )
        
        # Build context
        context = "\n\n".join(doc.page_content for doc in relevant_docs)
        
        # Extract source metadata
        sources = list(set(doc.metadata.get("source", "Unknown") for doc in relevant_docs))
        
        # Generate answer
        answer = generate_answer(context, query)
        
        return ChatResponse(
            answer=answer,
            sources=sources
        )
    
    except Exception as e:
        print(f"API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "database_loaded": db is not None}

# Entry point for local debugging (Docker/Spaces will use the command in Dockerfile)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)