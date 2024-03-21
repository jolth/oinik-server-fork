/*
 * Copyright 2023 Jorge Toro Hoyos (jolthgs@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const { createServer } = require('node:net');
const GPS103Parse = require('./GPS103Parse');

const HOST = "0.0.0.0"; 
const PORT = 7012;
const TIMEOUT = 240000;

const server = createServer();

server.on('connection', socket => {
    socket.setTimeout(TIMEOUT); // [config] 4 minutes of inactivity

    // [log / debug]
    console.log(`New client connected ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('end', () => {
        console.log("Closing connection with the client: ", socket.address());
    })

    socket.on('data', chunk => {
        // [log / debug]
        console.log(`${new Date()} [${chunk.length}] "${chunk.toString('ascii')}"`);

        socket._chunk = chunk;

        try {
            const entries = new GPS103Parse.Entries(chunk);
            switch (entries.cmd) {
                case 'A':
                    socket.write('LOAD');
                    console.log(entries.entries);
                    break;
                case 'HTBT':
                    socket.write('ON');
                    console.log(entries.entries);
                    break;
                default: // 'tracker', 'status', etc.
                    console.log(entries.entries);
                    break;
            }
        } catch (error) {
            socket.destroy(error);
        }
    })

    socket.on('error', err => {
        console.log('*********************************************************');
        console.log('CHUNK:', socket._chunk.toString('ascii'));
        console.error(`Socket ${socket.remoteAddPort}, ${err}`);
        console.log('STACK:');
        console.error(err.stack);
        console.log('STACK:');
        console.error(new Error().stack);
        console.log('*********************************************************');
    });

    socket.on('timeout', () => {
        console.log(`Socket timeout: ${socket.remoteAddPort}`);
        socket.end();
    });
})

server.listen(PORT, HOST, () => {
    console.log(`${new Date()} listening [${server.listening}] port [${server.address().port}].`);
})