#!/bin/bash

# Authentication API Test Script
# Make sure your backend server is running on http://localhost:3001

BASE_URL="http://localhost:3001/api/auth"
CONTENT_TYPE="Content-Type: application/json"

echo "🔐 Testing Authentication API Endpoints"
echo "========================================"

# Test 1: User Signup (JSON only - no file upload for this test)
echo -e "\n1. Testing User Signup..."
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/signup" \
  -H "$CONTENT_TYPE" \
  -d '{
    "name": "Test User",
    "userName": "testuser123",
    "email": "test@example.com",
    "password": "testpassword123",
    "role": "user"
  }')

echo "Signup Response:"
echo $SIGNUP_RESPONSE | jq '.' 2>/dev/null || echo $SIGNUP_RESPONSE

# Extract token from signup response
TOKEN=$(echo $SIGNUP_RESPONSE | jq -r '.data.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Signup successful! Token extracted."
else
    echo "❌ Signup failed or token not found."
    # Try to signup with different credentials
    echo -e "\nTrying with different credentials..."
    SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/signup" \
      -H "$CONTENT_TYPE" \
      -d '{
        "name": "Test User 2",
        "userName": "testuser456",
        "email": "test2@example.com",
        "password": "testpassword123",
        "role": "user"
      }')
    
    echo "Second Signup Response:"
    echo $SIGNUP_RESPONSE | jq '.' 2>/dev/null || echo $SIGNUP_RESPONSE
    TOKEN=$(echo $SIGNUP_RESPONSE | jq -r '.data.token' 2>/dev/null)
fi

# Test 2: User Login
echo -e "\n2. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }')

echo "Login Response:"
echo $LOGIN_RESPONSE | jq '.' 2>/dev/null || echo $LOGIN_RESPONSE

# Extract token from login if signup token is not available
if [ "$TOKEN" == "null" ] || [ "$TOKEN" == "" ]; then
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token' 2>/dev/null)
fi

# Test 3: Get User Profile (Protected Route)
if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo -e "\n3. Testing Get Profile (Protected Route)..."
    PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/profile" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Profile Response:"
    echo $PROFILE_RESPONSE | jq '.' 2>/dev/null || echo $PROFILE_RESPONSE
else
    echo -e "\n3. ❌ Cannot test protected routes - no valid token"
fi

# Test 4: Verify Token
if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo -e "\n4. Testing Token Verification..."
    VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/verify-token" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Verify Token Response:"
    echo $VERIFY_RESPONSE | jq '.' 2>/dev/null || echo $VERIFY_RESPONSE
else
    echo -e "\n4. ❌ Cannot test token verification - no valid token"
fi

# Test 5: Test Invalid Token
echo -e "\n5. Testing Invalid Token..."
INVALID_RESPONSE=$(curl -s -X GET "$BASE_URL/profile" \
  -H "Authorization: Bearer invalid_token_here")

echo "Invalid Token Response:"
echo $INVALID_RESPONSE | jq '.' 2>/dev/null || echo $INVALID_RESPONSE

# Test 6: Test Missing Token
echo -e "\n6. Testing Missing Token..."
NO_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/profile")

echo "No Token Response:"
echo $NO_TOKEN_RESPONSE | jq '.' 2>/dev/null || echo $NO_TOKEN_RESPONSE

# Test 7: Login with Wrong Credentials
echo -e "\n7. Testing Wrong Credentials..."
WRONG_CREDS_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }')

echo "Wrong Credentials Response:"
echo $WRONG_CREDS_RESPONSE | jq '.' 2>/dev/null || echo $WRONG_CREDS_RESPONSE

# Test 8: Logout
if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo -e "\n8. Testing Logout..."
    LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/logout" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Logout Response:"
    echo $LOGOUT_RESPONSE | jq '.' 2>/dev/null || echo $LOGOUT_RESPONSE
else
    echo -e "\n8. ❌ Cannot test logout - no valid token"
fi

echo -e "\n========================================"
echo "🏁 Authentication API Testing Complete!"
echo "========================================"
