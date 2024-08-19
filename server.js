const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        let textMessage;

        if (typeof message === 'string') {
            textMessage = message;
        } else if (Buffer.isBuffer(message)) {
            textMessage = message.toString('utf-8');
        }

        console.log(`Received message => ${textMessage}`);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(textMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error.message}`);
    });
});

server.listen(8083, () => {
    console.log('Server is listening on port 8083');
});
