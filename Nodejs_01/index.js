import http, { createServer } from 'http'


const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    switch (req.url) {
        case '/':
            res.end('Hello Home Page!\n');
        case '/about':
            res.end('Hello From about');
        default:
            res.end('Page Not Found')


    }

});



// starts a simple http server locally on port 3000
server.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});