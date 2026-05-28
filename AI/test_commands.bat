@echo off
REM MBKM Chatbot - Test Commands untuk Windows
REM Copy commands dan jalankan di PowerShell atau Command Prompt

setlocal enabledelayedexpansion

cls
echo ============================================================================
echo SPARK DTI - MBKM Chatbot Test Commands
echo ============================================================================
echo.

REM Health Checks
echo.
echo === HEALTH CHECKS ===
echo.
echo 1. AI Service Health Check:
echo    curl http://localhost:8000/api/mbkm/health
echo.

echo 2. Backend Health Check:
echo    curl http://localhost:5000/api/chat/health
echo.

REM Test Cases
echo.
echo === TEST CASES ===
echo.

echo Test 1: Magang 6 bulan (AI Service Direct):
echo    curl -X POST http://localhost:8000/api/mbkm/chat -H "Content-Type: application/json" -d "{\"message\": \"magang 6 bulan di Gojek\"}"
echo.

echo Test 2: Magang 6 bulan (via Backend):
echo    curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"message\": \"magang 6 bulan di Gojek\"}"
echo.

echo Test 3: Lomba 2 bulan:
echo    curl -X POST http://localhost:8000/api/mbkm/chat -H "Content-Type: application/json" -d "{\"message\": \"kompetisi nasional 2 bulan\"}"
echo.

echo Test 4: Pertukaran pelajar 4 bulan:
echo    curl -X POST http://localhost:8000/api/mbkm/chat -H "Content-Type: application/json" -d "{\"message\": \"pertukaran pelajar 4 bulan\"}"
echo.

echo Test 5: Studi independen 3 bulan:
echo    curl -X POST http://localhost:8000/api/mbkm/chat -H "Content-Type: application/json" -d "{\"message\": \"studi independen 3 bulan\"}"
echo.

echo Test 6: Magang 12 minggu:
echo    curl -X POST http://localhost:8000/api/mbkm/chat -H "Content-Type: application/json" -d "{\"message\": \"magang 12 minggu\"}"
echo.

REM Error Tests
echo.
echo === ERROR HANDLING TESTS ===
echo.

echo Error Test 1: Empty message:
echo    curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"message\": \"\"}"
echo.

REM Python Tests
echo.
echo === PYTHON TEST SUITE ===
echo.
echo Quick Test (30 seconds):
echo    cd AI
echo    python test_chatbot.py quick
echo.

echo Full Test Suite (2 minutes):
echo    cd AI
echo    python test_chatbot.py
echo.

echo.
echo ============================================================================
echo INSTRUCTIONS:
echo ============================================================================
echo.
echo 1. Copy any command above
echo 2. Paste in PowerShell or Command Prompt
echo 3. Press Enter to execute
echo.
echo Note: Make sure jq is installed for pretty JSON output
echo         Or use Python test suite: python test_chatbot.py
echo.
echo ============================================================================
