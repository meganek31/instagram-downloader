const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/indir' && parsedUrl.query.url) {
    const instagramUrl = parsedUrl.query.url;
    
    const postData = querystring.stringify({
      url: instagramUrl,
      v: '3',
      lang: 'en'
    });

    const options = {
      hostname: 'api.downloadgram.org',
      port: 443,
      path: '/media',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'Origin': 'https://downloadgram.org',
        'Referer': 'https://downloadgram.org/'
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      apiRes.on('end', () => {
        try {
          const urlMatch = data.match(/href=\\"(https:\/\/cdn\.downloadgram\.org\/\?token=[^"]+)\\"/);
          if (urlMatch && urlMatch[1]) {
            const videoUrl = urlMatch[1];
            
            https.get(videoUrl, (videoRes) => {
              res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="instagram_video.mp4"`
              });
              videoRes.pipe(res);
            }).on('error', (err) => {
              console.error('Video indirme hatası:', err);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Video indirilirken bir hata oluştu');
            });
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Video URL\'si bulunamadı', data);
          }
        } catch (error) {
          console.error('İçerik ayrıştırma hatası:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Bir hata oluştu');
        }
      });
    });

    apiReq.on('error', (error) => {
      console.error('API isteği hatası:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Bir hata oluştu');
    });

    apiReq.write(postData);
    apiReq.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Sayfa bulunamadı');
  }
});

const PORT = 80;
server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
