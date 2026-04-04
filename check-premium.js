// Quick check if premium status is set
const https = require('https');

const url = 'https://signal-theory-backend.onrender.com/api/usage?email=jeffrey.holst@gmail.com';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('Premium status:', json.tier);
    console.log('Full response:', JSON.stringify(json, null, 2));
    process.exit(json.tier === 'premium' ? 0 : 1);
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
