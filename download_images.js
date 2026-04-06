import https from 'https';
import fs from 'fs';

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function run() {
  await download('https://i.imgur.com/RtOyqo1.png', 'public/logo.png');
  await download('https://i.imgur.com/JfPzntG.jpeg', 'public/happy-collie.jpeg');
  await download('https://i.imgur.com/nOQely5.jpeg', 'public/collie-portrait.jpeg');
  await download('https://i.imgur.com/ENvUKnq.jpeg', 'public/woman-collie.jpeg');
  console.log('Downloads complete');
}

run();
