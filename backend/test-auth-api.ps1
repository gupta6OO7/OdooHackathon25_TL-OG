# Authentication API Test Script (PowerShell)
# Make sure your backend server is running on http://localhost:3001

$BaseUrl = "http://localhost:3001/api/auth"
$ContentType = "application/json"

Write-Host "🔐 Testing Authentication API Endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test 1: User Signup
Write-Host "`n1. Testing User Signup..." -ForegroundColor Yellow

$signupBody = @{
    name = "Test User"
    userName = "testuser123"
    email = "test@example.com"
    password = "testpassword123"
    role = "user"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$BaseUrl/signup" -Method Post -Body $signupBody -ContentType $ContentType
    Write-Host "Signup Response:" -ForegroundColor Green
    $signupResponse | ConvertTo-Json -Depth 10
    $token = $signupResponse.data.token
    Write-Host "✅ Signup successful! Token extracted." -ForegroundColor Green
} catch {
    Write-Host "❌ Signup failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try with different credentials
    Write-Host "`nTrying with different credentials..." -ForegroundColor Yellow
    $signupBody2 = @{
        name = "Test User 2"
        userName = "testuser456"
        email = "test2@example.com"
        password = "testpassword123"
        role = "user"
    } | ConvertTo-Json
    
    try {
        $signupResponse = Invoke-RestMethod -Uri "$BaseUrl/signup" -Method Post -Body $signupBody2 -ContentType $ContentType
        Write-Host "Second Signup Response:" -ForegroundColor Green
        $signupResponse | ConvertTo-Json -Depth 10
        $token = $signupResponse.data.token
    } catch {
        Write-Host "❌ Second signup also failed: $($_.Exception.Message)" -ForegroundColor Red
        $token = $null
    }
}

# Test 2: User Login
Write-Host "`n2. Testing User Login..." -ForegroundColor Yellow

$loginBody = @{
    email = "test@example.com"
    password = "testpassword123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/login" -Method Post -Body $loginBody -ContentType $ContentType
    Write-Host "Login Response:" -ForegroundColor Green
    $loginResponse | ConvertTo-Json -Depth 10
    
    if (-not $token) {
        $token = $loginResponse.data.token
    }
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get User Profile (Protected Route)
if ($token) {
    Write-Host "`n3. Testing Get Profile (Protected Route)..." -ForegroundColor Yellow
    
    $headers = @{
        'Authorization' = "Bearer $token"
    }
    
    try {
        $profileResponse = Invoke-RestMethod -Uri "$BaseUrl/profile" -Method Get -Headers $headers
        Write-Host "Profile Response:" -ForegroundColor Green
        $profileResponse | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "❌ Get profile failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n3. ❌ Cannot test protected routes - no valid token" -ForegroundColor Red
}

# Test 4: Verify Token
if ($token) {
    Write-Host "`n4. Testing Token Verification..." -ForegroundColor Yellow
    
    $headers = @{
        'Authorization' = "Bearer $token"
    }
    
    try {
        $verifyResponse = Invoke-RestMethod -Uri "$BaseUrl/verify-token" -Method Post -Headers $headers
        Write-Host "Verify Token Response:" -ForegroundColor Green
        $verifyResponse | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "❌ Token verification failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n4. ❌ Cannot test token verification - no valid token" -ForegroundColor Red
}

# Test 5: Test Invalid Token
Write-Host "`n5. Testing Invalid Token..." -ForegroundColor Yellow

$invalidHeaders = @{
    'Authorization' = "Bearer invalid_token_here"
}

try {
    $invalidResponse = Invoke-RestMethod -Uri "$BaseUrl/profile" -Method Get -Headers $invalidHeaders
    Write-Host "Invalid Token Response:" -ForegroundColor Green
    $invalidResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Expected error for invalid token: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 6: Test Missing Token
Write-Host "`n6. Testing Missing Token..." -ForegroundColor Yellow

try {
    $noTokenResponse = Invoke-RestMethod -Uri "$BaseUrl/profile" -Method Get
    Write-Host "No Token Response:" -ForegroundColor Green
    $noTokenResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Expected error for missing token: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 7: Login with Wrong Credentials
Write-Host "`n7. Testing Wrong Credentials..." -ForegroundColor Yellow

$wrongCredsBody = @{
    email = "test@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $wrongCredsResponse = Invoke-RestMethod -Uri "$BaseUrl/login" -Method Post -Body $wrongCredsBody -ContentType $ContentType
    Write-Host "Wrong Credentials Response:" -ForegroundColor Green
    $wrongCredsResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Expected error for wrong credentials: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 8: Logout
if ($token) {
    Write-Host "`n8. Testing Logout..." -ForegroundColor Yellow
    
    $headers = @{
        'Authorization' = "Bearer $token"
    }
    
    try {
        $logoutResponse = Invoke-RestMethod -Uri "$BaseUrl/logout" -Method Post -Headers $headers
        Write-Host "Logout Response:" -ForegroundColor Green
        $logoutResponse | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "❌ Logout failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n8. ❌ Cannot test logout - no valid token" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🏁 Authentication API Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
