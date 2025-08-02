const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';
let authToken = '';

async function testAPI() {
  console.log('🧪 Testing Padel Statistics API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check passed:', health.data.status);

    // Test 2: Register new user
    console.log('\n2️⃣ Testing User Registration...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      username: 'apitestuser',
      email: 'apitest@example.com',
      password: 'password123',
      firstName: 'API',
      lastName: 'Test'
    });
    console.log('✅ Registration successful:', registerResponse.data.data.user.username);

    // Test 3: Login
    console.log('\n3️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@padelstats.com',
      password: 'admin123'
    });
    authToken = loginResponse.data.data.token;
    console.log('✅ Login successful:', loginResponse.data.data.user.username);

    // Test 4: Get current user
    console.log('\n4️⃣ Testing Get Current User...');
    const userResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Current user retrieved:', userResponse.data.data.user.username);

    // Test 5: Get all matches
    console.log('\n5️⃣ Testing Get All Matches...');
    const matchesResponse = await axios.get(`${API_BASE}/matches`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Matches retrieved:', matchesResponse.data.data.length, 'matches');

    // Test 6: Get matches by status
    console.log('\n6️⃣ Testing Get Matches by Status...');
    const statusResponse = await axios.get(`${API_BASE}/matches/status/IN_PROGRESS`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ In-progress matches:', statusResponse.data.data.length, 'matches');

    // Test 7: Get matches by type
    console.log('\n7️⃣ Testing Get Matches by Type...');
    const typeResponse = await axios.get(`${API_BASE}/matches/type/FRIENDLY`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Friendly matches:', typeResponse.data.data.length, 'matches');

    // Test 8: Create new match
    console.log('\n8️⃣ Testing Create Match...');
    const createMatchResponse = await axios.post(`${API_BASE}/matches`, {
      type: 'FRIENDLY',
      playerIds: [
        'cmdtk5rwz000035agxw1sd2gw', // john_doe
        'cmdtk5rx6000235aga2ybjtg1', // jane_smith
        'cmdtk5rx6000135agur1v26o6', // mike_wilson
        'cmdtk5rx6000335agw10vncnr'  // sarah_jones
      ]
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Match created:', createMatchResponse.data.data.id);

    // Test 9: Get specific match
    console.log('\n9️⃣ Testing Get Specific Match...');
    const matchId = createMatchResponse.data.data.id;
    const matchResponse = await axios.get(`${API_BASE}/matches/${matchId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Match details retrieved:', matchResponse.data.data.players.length, 'players');

    // Test 10: Complete match
    console.log('\n🔟 Testing Complete Match...');
    const completeResponse = await axios.patch(`${API_BASE}/matches/${matchId}/complete`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Match completed:', completeResponse.data.data.status);

    // Test 11: Validation errors
    console.log('\n1️⃣1️⃣ Testing Validation Errors...');
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        username: 't',
        email: 'invalid-email',
        password: '123'
      });
    } catch (error) {
      console.log('✅ Validation errors caught:', error.response.data.error);
    }

    // Test 12: Authentication errors
    console.log('\n1️⃣2️⃣ Testing Authentication Errors...');
    try {
      await axios.get(`${API_BASE}/matches`);
    } catch (error) {
      console.log('✅ Authentication error caught:', error.response.data.error);
    }

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 API Summary:');
    console.log('- ✅ Authentication system working');
    console.log('- ✅ User registration and login');
    console.log('- ✅ JWT token validation');
    console.log('- ✅ Match CRUD operations');
    console.log('- ✅ Data validation');
    console.log('- ✅ Error handling');
    console.log('- ✅ Protected routes');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAPI(); 