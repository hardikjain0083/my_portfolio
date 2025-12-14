"""
Simple script to test the API endpoints locally
"""
import requests
import json
import time
import sys
# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Try port 7860 first (HuggingFace default), then 8000
BASE_URL = "http://localhost:7860"
ALTERNATIVE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing /api/health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        print("   Start it with: python app.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_chat(message="What are your skills?"):
    """Test chat endpoint"""
    print(f"\nTesting /api/chat endpoint with message: '{message}'...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"message": message},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Answer: {data.get('answer', 'N/A')[:200]}...")
        print(f"Sources: {data.get('sources', [])}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("API TEST SUITE")
    print("=" * 60)
    
    # Wait a bit for server to start and detect port
    print("\nWaiting for server to be ready...")
    global BASE_URL
    for i in range(10):
        for url in [BASE_URL, ALTERNATIVE_URL]:
            try:
                response = requests.get(f"{url}/api/health", timeout=2)
                if response.status_code == 200:
                    BASE_URL = url
                    print(f"✅ Server is ready on {url}!")
                    break
            except:
                pass
        else:
            time.sleep(1)
            print(f"   Attempt {i+1}/10...")
            continue
        break
    else:
        print("❌ Server not responding. Please start it first:")
        print("   cd portfolio_rag")
        print("   .\\venv\\Scripts\\Activate.ps1")
        print("   python app.py")
        print("\n   Or use uvicorn directly:")
        print("   uvicorn app:app --reload --host 0.0.0.0 --port 8000")
        sys.exit(1)
    
    # Test health
    health_ok = test_health()
    
    if not health_ok:
        print("\n❌ Health check failed. Cannot proceed.")
        sys.exit(1)
    
    # Test chat with different queries
    test_queries = [
        "What are your skills?",
        "Tell me about your projects",
        "What certifications do you have?"
    ]
    
    all_passed = True
    for query in test_queries:
        if not test_chat(query):
            all_passed = False
        time.sleep(1)  # Small delay between requests
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ ALL API TESTS PASSED!")
    else:
        print("❌ SOME TESTS FAILED")
    print("=" * 60)

if __name__ == "__main__":
    main()

