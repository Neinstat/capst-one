"""
MBKM Chatbot - Test Cases
Simple testing untuk verify implementasi
"""

import requests
import json

# Configuration
AI_SERVICE_URL = "http://localhost:8000"
BACKEND_URL = "http://localhost:5000"

# ─────────────────────────────────────────────────────────────────────────────
# Test Cases
# ─────────────────────────────────────────────────────────────────────────────

TEST_CASES = [
    {
        "name": "Test 1: Magang 6 bulan",
        "message": "magang 6 bulan di Gojek sebagai Backend Engineer",
        "expected": {
            "activity_type": "magang",
            "duration_weeks": 24,
            "estimated_sks": 20,
            "documents_count": 4
        }
    },
    {
        "name": "Test 2: Lomba 2 bulan",
        "message": "ikut kompetisi nasional selama 2 bulan",
        "expected": {
            "activity_type": "lomba",
            "duration_weeks": 8,
            "estimated_sks": 6,
            "documents_count": 4
        }
    },
    {
        "name": "Test 3: Pertukaran Pelajar 1 semester",
        "message": "pertukaran pelajar ke universitas luar negeri 4 bulan",
        "expected": {
            "activity_type": "pertukaran_pelajar",
            "duration_weeks": 16,
            "estimated_sks": 12,
            "documents_count": 4
        }
    },
    {
        "name": "Test 4: Studi Independen 3 bulan",
        "message": "studi independen membuat aplikasi mobile selama 3 bulan",
        "expected": {
            "activity_type": "studi_independen",
            "duration_weeks": 12,
            "estimated_sks": 9,
            "documents_count": 4
        }
    },
    {
        "name": "Test 5: Durasi dalam minggu (8 minggu)",
        "message": "magang 8 minggu di startup",
        "expected": {
            "activity_type": "magang",
            "duration_weeks": 8,
            "estimated_sks": 6,
            "documents_count": 4
        }
    },
    {
        "name": "Test 6: Unknown activity type",
        "message": "ikut webinar online selama 1 bulan",
        "expected": {
            "activity_type": "unknown",
            "duration_weeks": 4,
            "estimated_sks": 3,
            "documents_count": 4
        }
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# Test Functions
# ─────────────────────────────────────────────────────────────────────────────

def test_ai_service_health():
    """Test AI service health check"""
    print("\n" + "="*80)
    print("TEST: AI Service Health Check")
    print("="*80)
    
    try:
        response = requests.get(f"{AI_SERVICE_URL}/api/mbkm/health", timeout=5)
        if response.status_code == 200:
            print("✅ AI Service is running!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ AI Service returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to AI Service: {str(e)}")
        print(f"Make sure AI service is running at {AI_SERVICE_URL}")
        return False


def test_backend_health():
    """Test Backend health check"""
    print("\n" + "="*80)
    print("TEST: Backend Health Check")
    print("="*80)
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/chat/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Backend: {str(e)}")
        print(f"Make sure Backend is running at {BACKEND_URL}")
        return False


def test_ai_chat_endpoint(message):
    """Test AI chat endpoint directly"""
    print(f"\n📤 Sending to AI Service: {message}")
    
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/api/mbkm/chat",
            json={"message": message},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI Service Response:")
            print(f"   Reply: {data['reply'][:100]}...")
            print(f"   Activity Type: {data['data']['activity_type']}")
            print(f"   Duration: {data['data']['duration_weeks']} weeks")
            print(f"   Estimated SKS: {data['data']['estimated_sks']}")
            print(f"   Documents: {', '.join(data['data']['documents'])}")
            return data
        else:
            print(f"❌ AI Service returned status {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error calling AI Service: {str(e)}")
        return None


def test_backend_chat_endpoint(message):
    """Test Backend chat endpoint"""
    print(f"\n📤 Sending to Backend: {message}")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/chat",
            json={"message": message},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend Response:")
            print(f"   Reply: {data['reply'][:100]}...")
            print(f"   Activity Type: {data['data']['activity_type']}")
            print(f"   Duration: {data['data']['duration_weeks']} weeks")
            print(f"   Estimated SKS: {data['data']['estimated_sks']}")
            print(f"   Documents: {', '.join(data['data']['documents'])}")
            return data
        else:
            print(f"❌ Backend returned status {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error calling Backend: {str(e)}")
        return None


def verify_response(response_data, expected):
    """Verify response matches expected values"""
    if not response_data:
        return False
    
    data = response_data.get("data", {})
    
    checks = {
        "activity_type": data.get("activity_type") == expected["activity_type"],
        "duration_weeks": data.get("duration_weeks") == expected["duration_weeks"],
        "estimated_sks": data.get("estimated_sks") == expected["estimated_sks"],
        "documents_count": len(data.get("documents", [])) == expected["documents_count"]
    }
    
    all_pass = all(checks.values())
    
    if all_pass:
        print("✅ Response matches expected values!")
    else:
        print("⚠️  Response differs from expected:")
        for key, passed in checks.items():
            status = "✅" if passed else "❌"
            expected_val = expected.get(key)
            actual_val = data.get(key)
            print(f"   {status} {key}: expected {expected_val}, got {actual_val}")
    
    return all_pass


# ─────────────────────────────────────────────────────────────────────────────
# Main Test Runner
# ─────────────────────────────────────────────────────────────────────────────

def run_all_tests():
    """Run all tests"""
    print("\n" + "="*80)
    print("SPARK DTI - MBKM Chatbot Testing Suite")
    print("="*80)
    
    # 1. Health checks
    ai_healthy = test_ai_service_health()
    backend_healthy = test_backend_health()
    
    if not (ai_healthy and backend_healthy):
        print("\n❌ Cannot proceed with tests. Please ensure both services are running:")
        print(f"   - AI Service: {AI_SERVICE_URL}")
        print(f"   - Backend: {BACKEND_URL}")
        return
    
    # 2. Run test cases
    print("\n" + "="*80)
    print("Running Test Cases")
    print("="*80)
    
    passed_count = 0
    failed_count = 0
    
    for test_case in TEST_CASES:
        print(f"\n{test_case['name']}")
        print("-" * 80)
        
        # Test via AI Service directly
        print("\n[Testing AI Service directly]")
        ai_response = test_ai_chat_endpoint(test_case["message"])
        
        # Test via Backend
        print("\n[Testing via Backend]")
        backend_response = test_backend_chat_endpoint(test_case["message"])
        
        # Verify responses
        ai_verified = verify_response(ai_response, test_case["expected"])
        backend_verified = verify_response(backend_response, test_case["expected"])
        
        if ai_verified and backend_verified:
            passed_count += 1
            print(f"\n✅ {test_case['name']} PASSED")
        else:
            failed_count += 1
            print(f"\n❌ {test_case['name']} FAILED")
    
    # Summary
    print("\n" + "="*80)
    print("Test Summary")
    print("="*80)
    print(f"Total Tests: {len(TEST_CASES)}")
    print(f"✅ Passed: {passed_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"Success Rate: {(passed_count/len(TEST_CASES)*100):.1f}%")
    
    if failed_count == 0:
        print("\n🎉 All tests passed! Chatbot is working correctly!")
    else:
        print(f"\n⚠️  {failed_count} test(s) failed. Please check the logs above.")


def run_quick_test():
    """Run quick test - just verify health checks and one sample message"""
    print("\n" + "="*80)
    print("QUICK TEST - Health Check & Sample Message")
    print("="*80)
    
    ai_healthy = test_ai_service_health()
    backend_healthy = test_backend_health()
    
    if not (ai_healthy and backend_healthy):
        print("\n❌ Services not ready")
        return
    
    print("\n[Sample Message Test]")
    sample_message = "magang 6 bulan di startup"
    print(f"Message: {sample_message}")
    
    ai_response = test_ai_chat_endpoint(sample_message)
    backend_response = test_backend_chat_endpoint(sample_message)
    
    if ai_response and backend_response:
        print("\n✅ Quick test passed!")
    else:
        print("\n❌ Quick test failed!")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "quick":
        run_quick_test()
    else:
        run_all_tests()
    
    print("\n" + "="*80 + "\n")
