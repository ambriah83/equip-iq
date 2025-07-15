// Direct test of Limble API without proxy
// Run this in Node.js to bypass CORS

const LIMBLE_CLIENT_ID = '0IUG6E5S77MPV37ZGPM9LW7MAN41YZTH';
const LIMBLE_CLIENT_SECRET = 'H9QKLL2T1DVBID64XC91GVI3UFH63V';

async function testLimbleConnection() {
  const authString = Buffer.from(`${LIMBLE_CLIENT_ID}:${LIMBLE_CLIENT_SECRET}`).toString('base64');
  
  console.log('Testing Limble API connection...');
  console.log('Client ID:', LIMBLE_CLIENT_ID);
  console.log('Auth header:', `Basic ${authString.substring(0, 20)}...`);
  
  try {
    const response = await fetch('https://api.limblecmms.com/v2/assets?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    } else {
      const data = await response.json();
      console.log('Success! Found assets:', data);
    }
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

// Run the test
testLimbleConnection();