const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const logPath = 'C:\\Users\\Saumya Poojari\\Desktop\\1\\log_file.txt';
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);

    const lastLines = getLastLines(logPath, 10);
    ws.send(JSON.stringify(lastLines));

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

function getLastLines(filePath, linesCount) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.split('\n').filter(Boolean);  // filter out any empty lines
        return lines.slice(-linesCount);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];  // Return an empty array or handle the error as needed
    }
}


fs.watchFile(logPath, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
        const lastLines = getLastLines(logPath, 10);  // Fetch the last 10 lines whenever the file changes

        clients.forEach(client => {
            client.send(JSON.stringify(lastLines));
        });
    }
});

server.listen(8084, () => {
    console.log('Server is listening on port 8084');
});
