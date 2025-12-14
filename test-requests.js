const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, data: responseData });
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testRequestSystem() {
  console.log('=== Testing Request Management System ===\n');
  
  try {
    // 1. Create admin user
    console.log('1. Creating admin user...');
    const adminData = JSON.stringify({
      username: 'admin',
      password: 'admin123',
      role: 'ADMIN'
    });
    
    const adminOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(adminData)
      }
    };
    
    try {
      const adminResult = await makeRequest(adminOptions, adminData);
      console.log(`Admin creation status: ${adminResult.status}`);
      console.log(`Response: ${adminResult.data}\n`);
    } catch (error) {
      console.log('Admin user might already exist\n');
    }
    
    // 2. Login as admin
    console.log('2. Login as admin...');
    const adminLoginData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });
    
    const adminLoginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(adminLoginData)
      }
    };
    
    const adminLoginResult = await makeRequest(adminLoginOptions, adminLoginData);
    const adminLoginResponse = JSON.parse(adminLoginResult.data);
    const adminToken = adminLoginResponse.access_token;
    console.log(`Admin login status: ${adminLoginResult.status}`);
    console.log(`Admin token: ${adminToken.substring(0, 50)}...\n`);
    
    // 3. Create regular user
    console.log('3. Creating regular user...');
    const userData = JSON.stringify({
      username: 'testuser',
      password: 'user123'
    });
    
    const userOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(userData)
      }
    };
    
    try {
      const userResult = await makeRequest(userOptions, userData);
      console.log(`User creation status: ${userResult.status}`);
      console.log(`Response: ${userResult.data}\n`);
    } catch (error) {
      console.log('Regular user might already exist\n');
    }
    
    // 4. Login as regular user
    console.log('4. Login as regular user...');
    const userLoginData = JSON.stringify({
      username: 'testuser',
      password: 'user123'
    });
    
    const userLoginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(userLoginData)
      }
    };
    
    const userLoginResult = await makeRequest(userLoginOptions, userLoginData);
    const userLoginResponse = JSON.parse(userLoginResult.data);
    const userToken = userLoginResponse.access_token;
    console.log(`User login status: ${userLoginResult.status}`);
    console.log(`User token: ${userToken.substring(0, 50)}...\n`);
    
    // 5. Create a request as regular user
    console.log('5. Creating a request as regular user...');
    const requestData = JSON.stringify({
      title: 'Request for new computer',
      description: 'I need a new computer for my work tasks'
    });
    
    const createRequestOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/requests',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
        'Content-Length': Buffer.byteLength(requestData)
      }
    };
    
    const createRequestResult = await makeRequest(createRequestOptions, requestData);
    const createdRequest = JSON.parse(createRequestResult.data);
    console.log(`Create request status: ${createRequestResult.status}`);
    console.log(`Created request: ID ${createdRequest.id}, Status: ${createdRequest.status}\n`);
    
    // 6. Try to update status as regular user (should fail)
    console.log('6. Trying to update status as regular user (should fail)...');
    const updateStatusData = JSON.stringify({
      status: 'IN_PROGRESS'
    });
    
    const updateStatusOptions = {
      hostname: 'localhost',
      port: 3000,
      path: `/requests/${createdRequest.id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
        'Content-Length': Buffer.byteLength(updateStatusData)
      }
    };
    
    const updateStatusResult = await makeRequest(updateStatusOptions, updateStatusData);
    console.log(`Update status as user: ${updateStatusResult.status}`);
    console.log(`Response: ${updateStatusResult.data}\n`);
    
    // 7. Update status as admin (should succeed)
    console.log('7. Updating status as admin (should succeed)...');
    const adminUpdateOptions = {
      hostname: 'localhost',
      port: 3000,
      path: `/requests/${createdRequest.id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Content-Length': Buffer.byteLength(updateStatusData)
      }
    };
    
    const adminUpdateResult = await makeRequest(adminUpdateOptions, updateStatusData);
    console.log(`Update status as admin: ${adminUpdateResult.status}`);
    console.log(`Response: ${adminUpdateResult.data}\n`);
    
    // 8. Try to update description when not PENDING (should fail)
    console.log('8. Trying to update description when status is IN_PROGRESS (should fail)...');
    const updateDescData = JSON.stringify({
      description: 'Updated description'
    });
    
    const updateDescOptions = {
      hostname: 'localhost',
      port: 3000,
      path: `/requests/${createdRequest.id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
        'Content-Length': Buffer.byteLength(updateDescData)
      }
    };
    
    const updateDescResult = await makeRequest(updateDescOptions, updateDescData);
    console.log(`Update description as user: ${updateDescResult.status}`);
    console.log(`Response: ${updateDescResult.data}\n`);
    
    // 9. Get all requests as admin
    console.log('9. Getting all requests as admin...');
    const getAllOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/requests',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    };
    
    const getAllResult = await makeRequest(getAllOptions);
    console.log(`Get all requests status: ${getAllResult.status}`);
    const allRequests = JSON.parse(getAllResult.data);
    console.log(`Found ${allRequests.length} requests\n`);
    
    // 10. Get all requests as regular user
    console.log('10. Getting all requests as regular user...');
    const getUserRequestsOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/requests',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    };
    
    const getUserRequestsResult = await makeRequest(getUserRequestsOptions);
    console.log(`Get user requests status: ${getUserRequestsResult.status}`);
    const userRequests = JSON.parse(getUserRequestsResult.data);
    console.log(`Found ${userRequests.length} requests for user\n`);
    
    console.log('=== Test completed successfully! ===');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testRequestSystem();
