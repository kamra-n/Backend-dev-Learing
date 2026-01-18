import { createServer } from 'http'
import fs from 'node:fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    switch (req.url) {
        case '/':
            const date = new Date().toISOString();

            await fs.promises.appendFile(__dirname + '/logs.txt', `New Logs from / route at ${date} \n`);
            res.end('Hello From home');
            break;

        case '/about':
            res.end('Hello From about');
            break;  // <-- Important!

        default:
            res.end('Page Not Found');
            break;
    }

});



// starts a simple http server locally on port 3000
server.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});