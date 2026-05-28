#!/bin/bash
# MBKM Chatbot - Ready-to-use Test Commands
# Copy-paste dan jalankan di terminal

# ─────────────────────────────────────────────────────────────────────────────
# HEALTH CHECKS
# ─────────────────────────────────────────────────────────────────────────────

echo "=== HEALTH CHECKS ==="

echo "1. AI Service Health Check"
curl http://localhost:8000/api/mbkm/health | jq .

echo ""
echo "2. Backend Health Check"
curl http://localhost:5000/api/chat/health | jq .


# ─────────────────────────────────────────────────────────────────────────────
# TEST CASES - AI SERVICE DIRECTLY
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo ""
echo "=== TEST AI SERVICE DIRECTLY (POST /api/mbkm/chat) ==="

echo ""
echo "Test 1: Magang 6 bulan"
curl -X POST http://localhost:8000/api/mbkm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "magang 6 bulan di Gojek"}' | jq .

echo ""
echo "Test 2: Lomba 2 bulan"
curl -X POST http://localhost:8000/api/mbkm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "kompetisi nasional 2 bulan"}' | jq .

echo ""
echo "Test 3: Pertukaran pelajar 4 bulan"
curl -X POST http://localhost:8000/api/mbkm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "pertukaran pelajar ke universitas luar negeri 4 bulan"}' | jq .

echo ""
echo "Test 4: Studi independen 3 bulan"
curl -X POST http://localhost:8000/api/mbkm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "studi independen membuat aplikasi mobile 3 bulan"}' | jq .

echo ""
echo "Test 5: Durasi dalam minggu (12 minggu)"
curl -X POST http://localhost:8000/api/mbkm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "magang 12 minggu di startup"}' | jq .

echo ""
echo "Test 6: Unknown activity (default fallback)"
curl -X POST http://localhost:8000/api/mbkm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "ikut webinar online 1 bulan"}' | jq .


# ─────────────────────────────────────────────────────────────────────────────
# TEST CASES - VIA BACKEND PROXY
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo ""
echo "=== TEST VIA BACKEND (POST /api/chat) ==="

echo ""
echo "Test 1: Magang 6 bulan (via Backend)"
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "magang 6 bulan di Tokopedia"}' | jq .

echo ""
echo "Test 2: Lomba nasional (via Backend)"
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "juara 1 lomba programming nasional selama 3 bulan persiapan"}' | jq .


# ─────────────────────────────────────────────────────────────────────────────
# ERROR HANDLING TESTS
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo ""
echo "=== ERROR HANDLING TESTS ==="

echo ""
echo "Test Error 1: Empty message"
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": ""}' | jq .

echo ""
echo "Test Error 2: No message field"
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}' | jq .

echo ""
echo "Test Error 3: Invalid JSON"
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d 'invalid-json' | jq .


# ─────────────────────────────────────────────────────────────────────────────
# RAW RESPONSES (Without jq)
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo ""
echo "=== RAW RESPONSES (no formatting) ==="

echo ""
echo "AI Service - Raw Response:"
curl -X POST http://localhost:8000/api/mbkm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "magang 6 bulan di startup"}'

echo ""
echo ""
echo "Backend - Raw Response:"
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "magang 6 bulan di startup"}'


# ─────────────────────────────────────────────────────────────────────────────
# AUTOMATED TEST RUNNER
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo ""
echo "=== AUTOMATED PYTHON TEST SUITE ==="
echo ""
echo "Run quick test (30 sec):"
echo "  cd AI && python test_chatbot.py quick"
echo ""
echo "Run full test suite (2 min):"
echo "  cd AI && python test_chatbot.py"
