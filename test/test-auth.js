const http = require('http');

const postData = JSON.stringify({
  username: 'davidpino',
  password: 'qwerty'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response:', data);
    
    // Now test login
    const loginData = JSON.stringify({
      username: 'davidpino',
      password: 'qwerty'
    });
    
    const loginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };
    
    const loginReq = http.request(loginOptions, (loginRes) => {
      console.log(`Login Status: ${loginRes.statusCode}`);
      let loginDataResponse = '';
      loginRes.setEncoding('utf8');
      loginRes.on('data', (chunk) => {
        loginDataResponse += chunk;
      });
      loginRes.on('end', () => {
        console.log('Login Response:', loginDataResponse);
        
        try {
          const loginResult = JSON.parse(loginDataResponse);
          const token = loginResult.access_token;
          
          // Now test protected route
          const protectedOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/protected',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          
          const protectedReq = http.request(protectedOptions, (protectedRes) => {
            console.log(`Protected Status: ${protectedRes.statusCode}`);
            let protectedData = '';
            protectedRes.setEncoding('utf8');
            protectedRes.on('data', (chunk) => {
              protectedData += chunk;
            });
            protectedRes.on('end', () => {
              console.log('Protected Response:', protectedData);
            });
          });
          
          protectedReq.on('error', (e) => {
            console.error(`Protected error: ${e.message}`);
          });
          
          protectedReq.end();
          
        } catch (e) {
          console.error('Error parsing login response:', e);
        }
      });
    });
    
    loginReq.on('error', (e) => {
      console.error(`Login error: ${e.message}`);
    });
    
    loginReq.write(loginData);
    loginReq.end();
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
