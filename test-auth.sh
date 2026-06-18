#!/bin/bash
echo "=== Testing Appwrite Session Flow ==="
echo ""

# Test 1: Check API endpoint directly (no session)
echo "Test 1: Check session endpoint (no session)"
curl -s http://localhost:3000/api/debug/session | jq . || echo "Request failed"
echo ""

# Test 2: Login and capture cookies
echo "Test 2: Attempting login..."
curl -s -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gga.com","password":"Password@123"}' \
  -v 2>&1 | head -50
echo ""

# Test 3: Try to access dashboard
echo "Test 3: Try to access dashboard..."
curl -s http://localhost:3000/admin/dashboard | head -50
echo ""

echo "=== Tests Complete ==="
