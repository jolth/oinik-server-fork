/*
 * Copyright 2024 Jorge Toro Hoyos (jolthgs@gmail.com)
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

const HOST = "0.0.0.0"; 
const PORT = 7011;
const TIMEOUT = 240000;
const LENGTHFORECHO = 25;

const server = createServer();

server.on('connection', socket => {
    //socket.setEncoding('utf8');
    socket.setTimeout(TIMEOUT); // [config] 4 minutes of inactivity

    // [log / debug]
    //socket.remoteAddPort = `${socket.remoteAddress}:${socket.remotePort}`;
    //console.log(`Client connected ${socket.remoteAddPort}`);
    console.log(`New client connected ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('end', () => {
        console.log("Closing connection with the client: ", socket.address());
    })

    socket.on('data', chunk => {
        // [log / debug]
        console.log(`${new Date()} [${chunk.length}] "${chunk.toString('ascii')}"`);

        if (chunk.length <= LENGTHFORECHO) {
            socket.write(chunk);
            return;
        }

        console.log('Decode', chunk.toString('ascii'));
    })

    socket.on('error', err => {
        console.error(`Socket ${socket.remoteAddPort} Error: ${err}`);
        console.log('*******************');
        console.error(err.stack);
        console.log('*******************');
        console.error(new Error().stack);
    });
})

server.listen(PORT, HOST, () => {
    console.log(`${new Date()} listening [${server.listening}] port [${server.address().port}].`);
})
