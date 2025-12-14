import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# -----------------------------
# Load Vector Store
# -----------------------------
PERSIST_DIRECTORY = "db/chroma_db"

embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory=PERSIST_DIRECTORY,
    embedding_function=embedding_model,
    collection_metadata={"hnsw:space": "cosine"}
)

# -----------------------------
# Query
# -----------------------------
query = ""

retriever = db.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "k": 5,
        "score_threshold": 0.3
    }
)

relevant_docs = retriever.invoke(query)

print(f"User Query: {query}")
print("\n--- Retrieved Context ---")
for i, doc in enumerate(relevant_docs, 1):
    print(f"Chunk {i}:\n{doc.page_content}\n")

# -----------------------------
# Build Context
# -----------------------------
context = "\n\n".join(doc.page_content for doc in relevant_docs)

# -----------------------------
# Groq LLM
# -----------------------------
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

client = Groq(api_key=groq_api_key)

def generate_answer(context: str, query: str) -> str:
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
# Generate Answer
# -----------------------------
answer = generate_answer(context, query)
print("\n--- Final Answer ---")
print(answer)
