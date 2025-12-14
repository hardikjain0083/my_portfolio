# Testing Guide for Ingestion and Retrieval Pipelines

## Summary of Fixes

### Issues Found and Fixed:

1. **Ingestion Pipeline**:
   - ✅ Added UTF-8 encoding handling for text files
   - ✅ Prevents encoding errors when loading documents

2. **Retrieval Pipeline**:
   - ✅ Fixed empty query string issue
   - ✅ Added proper test query

3. **Backend API**:
   - ✅ Lowered similarity threshold from 0.3 to 0.2
   - ✅ Added multi-tier fallback retrieval system
   - ✅ Enhanced logging for debugging

## Test Results

✅ **All tests passed!**

- Database contains **55 documents**
- Retrieval is working correctly
- Full RAG pipeline with Groq LLM is functional

## How to Test Locally

### Step 1: Test Ingestion and Retrieval Pipelines

```powershell
cd portfolio_rag
.\venv\Scripts\Activate.ps1
python test_pipeline.py
```

This will:
- Check if database exists
- Test document loading
- Test chunking
- Test vector store creation (if needed)
- Test retrieval with multiple queries
- Test full RAG pipeline with Groq

**Expected Output:**
```
✅ Database contains 55 documents
✅ Threshold retriever found X documents
✅ Similarity retriever found X documents
✅ Generated Answer: [answer text]
✅ ALL TESTS PASSED!
```

### Step 2: Start the Backend Server

**Option A: Using app.py (port 7860 - HuggingFace default)**
```powershell
cd portfolio_rag
.\venv\Scripts\Activate.ps1
python app.py
```

**Option B: Using uvicorn directly (port 8000 - local dev)**
```powershell
cd portfolio_rag
.\venv\Scripts\Activate.ps1
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Step 3: Test the API

**Option A: Using the test script**
```powershell
cd portfolio_rag
.\venv\Scripts\Activate.ps1
python test_api.py
```

**Option B: Using PowerShell**
```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:8000/api/health" -Method GET

# Test chat endpoint
$body = @{message="What are your skills?"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/chat" -Method POST -Body $body -ContentType "application/json"
```

**Option C: Using curl (if available)**
```bash
# Health check
curl http://localhost:8000/api/health

# Chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your skills?"}'
```

## Test Queries to Try

1. "What are your skills?"
2. "Tell me about your projects"
3. "What is your experience?"
4. "What certifications do you have?"
5. "What programming languages do you know?"

## Troubleshooting

### Issue: "No module named 'langchain_chroma'"
**Solution**: Activate the virtual environment first
```powershell
.\venv\Scripts\Activate.ps1
```

### Issue: "Database is empty"
**Solution**: Run ingestion pipeline
```powershell
python ingestion_pipeline.py
```

### Issue: "Server not responding"
**Solution**: 
1. Check if server is running: `netstat -an | findstr :8000`
2. Check server logs for errors
3. Make sure port 8000 is not in use by another application

### Issue: "No documents retrieved"
**Solution**:
1. Check database exists: `ls db/chroma_db/`
2. Verify document count in health endpoint
3. Check server logs for retrieval errors
4. Try lowering threshold further in `app.py` (line 54)

### Issue: "UnicodeEncodeError" in Windows
**Solution**: The test scripts now handle this automatically, but if you see it:
- Use PowerShell or Command Prompt (not Git Bash)
- The scripts set UTF-8 encoding automatically

## Files Created/Modified

1. **test_pipeline.py** - Comprehensive test for ingestion and retrieval
2. **test_api.py** - API endpoint testing script
3. **ingestion_pipeline.py** - Fixed encoding handling
4. **retrieval_pipeline.py** - Fixed empty query issue
5. **app.py** - Enhanced with fallback retrieval and better logging

## Next Steps

1. ✅ Test pipelines locally - **DONE**
2. ✅ Verify retrieval is working - **DONE**
3. ⏭️ Deploy updated backend to HuggingFace
4. ⏭️ Test HuggingFace backend with frontend
5. ⏭️ Deploy frontend to Vercel

## Notes

- The backend runs on port **7860** by default (for HuggingFace)
- For local testing, you can use port **8000** with uvicorn
- The database contains **55 documents** (chunks)
- Retrieval uses a **3-tier fallback system** to ensure documents are found
- Similarity threshold is set to **0.2** (lowered from 0.3 for better retrieval)

