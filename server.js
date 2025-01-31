const http = require('http');
const url = require('url');
const instagramUrlDirect = require('instagram-url-direct');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/indir' && parsedUrl.query.url) {
    const instagramUrl = parsedUrl.query.url;
    
    instagramUrlDirect(instagramUrl)
      .then(result => {
        if (result && result.url_list && result.url_list.length > 0) {
          const videoUrl = result.url_list[0];
          
          // Video URL'sine yönlendir
          res.writeHead(302, { 'Location': videoUrl });
          res.end();
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Video bulunamadı');
        }
      })
      .catch(error => {
        console.error('Hata:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Sunucu hatası');
      });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Sayfa bulunamadı');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
