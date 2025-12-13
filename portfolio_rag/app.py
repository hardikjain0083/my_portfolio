from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI(title="Portfolio RAG Chatbot")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load Vector Store
# -----------------------------
PERSIST_DIRECTORY = "db/chroma_db"

print("Loading embedding model...")
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

print("Loading vector database...")
db = Chroma(
    persist_directory=PERSIST_DIRECTORY,
    embedding_function=embedding_model,
    collection_metadata={"hnsw:space": "cosine"}
)

# Initialize retriever
retriever = db.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "k": 5,
        "score_threshold": 0.3
    }
)

# -----------------------------
# Groq LLM Client
# -----------------------------
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

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

# -----------------------------
# API Endpoints
# -----------------------------
@app.get("/")
async def read_root():
    """Serve the frontend HTML file"""
    return FileResponse("index.html")

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handle chat requests"""
    try:
        query = request.message.strip()
        
        if not query:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Retrieve relevant documents
        relevant_docs = retriever.invoke(query)
        
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
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Chatbot API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

