const fetch = require('node-fetch');

const baseUrl = 'http://localhost:5000';

async function testAuth() {
  console.log('🧪 Testing OneShot Authentication System');
  console.log('==========================================\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);
    console.log('');

    // Test 2: Register new user
    console.log('2. Testing user registration...');
    const registerData = {
      email: 'testuser@example.com',
      password: 'TestPass123'
    };

    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });

    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ Registration successful');
      console.log(`📧 User: ${registerResult.user.email}`);
      console.log(`🆔 ID: ${registerResult.user.id}`);
      console.log(`🔑 Token: ${registerResult.token.substring(0, 20)}...`);
      console.log('');

      // Test 3: Login with same credentials
      console.log('3. Testing user login...');
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log('✅ Login successful');
        console.log(`🔑 Token: ${loginResult.token.substring(0, 20)}...`);
        
        // Test 4: Protected route access
        console.log('');
        console.log('4. Testing protected route access...');
        const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${loginResult.token}`
          }
        });

        if (meResponse.ok) {
          const meResult = await meResponse.json();
          console.log('✅ Protected route access successful');
          console.log(`👤 User: ${meResult.user.email}`);
          console.log('');
        } else {
          console.log('❌ Protected route access failed');
          console.log(await meResponse.text());
        }

        // Test 5: Invalid login
        console.log('5. Testing invalid login...');
        const invalidLoginResponse = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'testuser@example.com',
            password: 'WrongPassword'
          })
        });

        if (!invalidLoginResponse.ok) {
          console.log('✅ Invalid login correctly rejected');
          console.log('');
        } else {
          console.log('❌ Invalid login should have been rejected');
        }

        // Test 6: Duplicate registration
        console.log('6. Testing duplicate registration...');
        const dupRegisterResponse = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        });

        if (!dupRegisterResponse.ok) {
          const dupError = await dupRegisterResponse.json();
          console.log('✅ Duplicate registration correctly rejected');
          console.log(`📋 Error: ${dupError.message}`);
          console.log('');
        } else {
          console.log('❌ Duplicate registration should have been rejected');
        }

      } else {
        console.log('❌ Login failed');
        console.log(await loginResponse.text());
      }

    } else {
      console.log('❌ Registration failed');
      const error = await registerResponse.json();
      console.log('Error:', error);
    }

    console.log('🎯 Authentication tests completed!');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run tests
testAuth();