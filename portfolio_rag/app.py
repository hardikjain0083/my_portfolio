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
PERSIST_DIRECTORY = "db/chroma_db"

# Check if DB exists to prevent crash on startup
if not os.path.exists(PERSIST_DIRECTORY):
    print(f"WARNING: Persist directory '{PERSIST_DIRECTORY}' not found. Please ensure you uploaded your 'db' folder.")

print("Loading embedding model...")
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

print(f"Loading vector database from {PERSIST_DIRECTORY}...")
retriever = None
fallback_retriever = None
try:
    db = Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embedding_model,
        collection_metadata={"hnsw:space": "cosine"}
    )
    # Initialize retriever with fallback mechanism
    # First try similarity_score_threshold, but with lower threshold
    retriever = db.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={
            "k": 5,
            "score_threshold": 0.2  # Lowered from 0.3 to 0.2 for better retrieval
        }
    )
    
    # Create a fallback retriever without threshold for when no docs are found
    fallback_retriever = db.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )
except Exception as e:
    print(f"Error loading vector database: {e}")
    db = None
    retriever = None
    fallback_retriever = None

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

        # Retrieve relevant documents with primary retriever
        relevant_docs = []
        try:
            relevant_docs = retriever.invoke(query)
            print(f"Primary retriever found {len(relevant_docs)} documents")
        except Exception as e:
            print(f"Primary retriever error: {e}")
        
        # Fallback: If no documents found, use fallback retriever without threshold
        if not relevant_docs and fallback_retriever:
            try:
                print("Using fallback retriever (no threshold)...")
                relevant_docs = fallback_retriever.invoke(query)
                print(f"Fallback retriever found {len(relevant_docs)} documents")
            except Exception as e:
                print(f"Fallback retriever error: {e}")
        
        # If still no documents, check if database has any documents at all
        if not relevant_docs:
            try:
                # Try to get any documents from the database
                all_docs = db.similarity_search(query, k=3)
                if all_docs:
                    print(f"Found {len(all_docs)} documents using direct similarity_search")
                    relevant_docs = all_docs
            except Exception as e:
                print(f"Direct search error: {e}")
        
        # Log retrieval details for debugging
        if relevant_docs:
            print(f"Retrieved {len(relevant_docs)} relevant chunks")
            for i, doc in enumerate(relevant_docs[:2]):  # Log first 2
                print(f"  Chunk {i+1}: {len(doc.page_content)} chars from {doc.metadata.get('source', 'Unknown')}")
        else:
            print("WARNING: No documents retrieved for query:", query)
            return ChatResponse(
                answer="I don't have enough information based on the provided documents. Please try rephrasing your question or ask about my skills, experience, projects, or education.",
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
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    db_status = "loaded" if db is not None else "not loaded"
    doc_count = 0
    sample_query_result = None
    try:
        if db:
            # Try to get collection count
            collection = db._collection
            if collection:
                doc_count = collection.count()
                # Try a sample query to see if retrieval works
                try:
                    sample_docs = db.similarity_search("skills", k=1)
                    sample_query_result = {
                        "found_documents": len(sample_docs),
                        "working": len(sample_docs) > 0
                    }
                except Exception as e:
                    sample_query_result = {"error": str(e)}
    except Exception as e:
        print(f"Error getting doc count: {e}")
    
    return {
        "status": "healthy", 
        "database_loaded": db is not None,
        "database_status": db_status,
        "document_count": doc_count,
        "sample_query": sample_query_result
    }

# Entry point for local debugging (Docker/Spaces will use the command in Dockerfile)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)