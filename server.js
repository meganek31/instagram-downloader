const http = require('http');
const instagramUrlDirect = require('instagram-url-direct');

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/indir' && url.searchParams.has('url')) {
    instagramUrlDirect(url.searchParams.get('url'))
      .then(result => {
        if (result?.url_list?.[0]) {
          res.writeHead(302, { 'Location': result.url_list[0] });
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
}).listen(3000, () => console.log('Sunucu http://localhost:3000 adresinde çalışıyor'));
