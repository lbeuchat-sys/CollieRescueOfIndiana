const https = require('https');

https.get('https://api.imgur.com/3/album/8zGhuSY/images', {
  headers: {
    'Authorization': 'Client-ID 546c25a59c58ad7'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
