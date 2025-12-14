"""
Test script to verify ingestion and retrieval pipelines are working correctly.
Run this to test both pipelines locally.
"""
import os
import sys
# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

# Import functions from ingestion pipeline
from ingestion_pipeline import load_documents, split_documents, create_vector_store

def test_ingestion():
    """Test the ingestion pipeline"""
    print("=" * 60)
    print("TESTING INGESTION PIPELINE")
    print("=" * 60)
    
    try:
        # Step 1: Load documents
        print("\n[1/3] Loading documents...")
        documents = load_documents(docs_path="docs")
        print(f"✅ Loaded {len(documents)} documents")
        
        # Step 2: Split into chunks
        print("\n[2/3] Splitting documents into chunks...")
        chunks = split_documents(documents, chunk_size=1000, chunk_overlap=0)
        print(f"✅ Created {len(chunks)} chunks")
        
        # Step 3: Create vector store
        print("\n[3/3] Creating vector store...")
        vectorstore = create_vector_store(chunks, persist_directory="db/chroma_db")
        print(f"✅ Vector store created and persisted")
        
        # Verify the database
        print("\n[VERIFICATION] Checking database...")
        collection = vectorstore._collection
        count = collection.count()
        print(f"✅ Database contains {count} documents")
        
        return True, vectorstore
        
    except Exception as e:
        print(f"\n❌ Ingestion failed: {e}")
        import traceback
        traceback.print_exc()
        return False, None

def test_retrieval(vectorstore=None):
    """Test the retrieval pipeline"""
    print("\n" + "=" * 60)
    print("TESTING RETRIEVAL PIPELINE")
    print("=" * 60)
    
    try:
        # Load database if not provided
        if vectorstore is None:
            print("\n[1/3] Loading vector database...")
            embedding_model = HuggingFaceEmbeddings(
                model_name="all-MiniLM-L6-v2"
            )
            db = Chroma(
                persist_directory="db/chroma_db",
                embedding_function=embedding_model,
                collection_metadata={"hnsw:space": "cosine"}
            )
            print("✅ Database loaded")
        else:
            db = vectorstore
            print("✅ Using existing vectorstore")
        
        # Check document count
        collection = db._collection
        doc_count = collection.count()
        print(f"✅ Database contains {doc_count} documents")
        
        if doc_count == 0:
            print("\n❌ ERROR: Database is empty! Run ingestion first.")
            return False
        
        # Test queries
        test_queries = [
            "What are your skills?",
            "Tell me about your projects",
            "What is your experience?",
            "What certifications do you have?"
        ]
        
        print("\n[2/3] Testing retrieval with different queries...")
        print("-" * 60)
        
        # Test with threshold retriever
        retriever_threshold = db.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={
                "k": 5,
                "score_threshold": 0.2
            }
        )
        
        # Test with regular similarity retriever
        retriever_similarity = db.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )
        
        for query in test_queries:
            print(f"\n📝 Query: '{query}'")
            
            # Try threshold retriever
            try:
                docs_threshold = retriever_threshold.invoke(query)
                print(f"  Threshold retriever (0.2): {len(docs_threshold)} documents")
                if docs_threshold:
                    print(f"    First chunk preview: {docs_threshold[0].page_content[:100]}...")
            except Exception as e:
                print(f"  Threshold retriever error: {e}")
            
            # Try similarity retriever
            try:
                docs_similarity = retriever_similarity.invoke(query)
                print(f"  Similarity retriever: {len(docs_similarity)} documents")
                if docs_similarity:
                    print(f"    First chunk preview: {docs_similarity[0].page_content[:100]}...")
            except Exception as e:
                print(f"  Similarity retriever error: {e}")
            
            # Try direct search
            try:
                docs_direct = db.similarity_search(query, k=3)
                print(f"  Direct search: {len(docs_direct)} documents")
                if docs_direct:
                    print(f"    First chunk preview: {docs_direct[0].page_content[:100]}...")
            except Exception as e:
                print(f"  Direct search error: {e}")
        
        print("\n[3/3] Testing full RAG pipeline with Groq...")
        print("-" * 60)
        
        # Test with Groq LLM
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            print("⚠️  GROQ_API_KEY not set, skipping LLM test")
            return True
        
        from groq import Groq
        client = Groq(api_key=groq_api_key)
        
        test_query = "What are your technical skills?"
        print(f"\n📝 Query: '{test_query}'")
        
        # Retrieve documents
        docs = retriever_similarity.invoke(test_query)
        if not docs:
            docs = db.similarity_search(test_query, k=3)
        
        if docs:
            context = "\n\n".join(doc.page_content for doc in docs)
            print(f"✅ Retrieved {len(docs)} documents")
            print(f"   Context length: {len(context)} characters")
            
            # Generate answer
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
                        "content": f"Context:\n{context}\n\nQuestion:\n{test_query}"
                    }
                ],
                temperature=0.2
            )
            
            answer = response.choices[0].message.content
            print(f"\n✅ Generated Answer:")
            print(f"   {answer[:200]}...")
        else:
            print("❌ No documents retrieved for test query")
            return False
        
        print("\n" + "=" * 60)
        print("✅ RETRIEVAL PIPELINE TEST PASSED")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"\n❌ Retrieval test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("PORTFOLIO RAG PIPELINE TEST SUITE")
    print("=" * 60)
    
    # Check if database exists
    db_exists = os.path.exists("db/chroma_db/chroma.sqlite3")
    
    if not db_exists:
        print("\n⚠️  Database not found. Running ingestion first...")
        success, vectorstore = test_ingestion()
        if not success:
            print("\n❌ Ingestion failed. Cannot proceed with retrieval test.")
            sys.exit(1)
    else:
        print("\n✅ Database exists. Skipping ingestion.")
        print("   (To re-ingest, delete db/chroma_db folder and run again)")
        vectorstore = None
    
    # Test retrieval
    success = test_retrieval(vectorstore)
    
    if success:
        print("\n" + "=" * 60)
        print("🎉 ALL TESTS PASSED!")
        print("=" * 60)
        print("\nYour pipelines are working correctly!")
        print("You can now:")
        print("  1. Start the backend: python app.py")
        print("  2. Test the API: curl -X POST http://localhost:8000/api/chat -H 'Content-Type: application/json' -d '{\"message\": \"What are your skills?\"}'")
    else:
        print("\n" + "=" * 60)
        print("❌ TESTS FAILED")
        print("=" * 60)
        print("\nPlease check the errors above and fix them.")
        sys.exit(1)

if __name__ == "__main__":
    main()

