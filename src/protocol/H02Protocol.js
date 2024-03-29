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
'use strict'

import { Protocol } from './BaseProtocol.js'
import { Frame } from './H02Parse.js';

const HOST = "0.0.0.0";
const PORT = 17011;
const TIMEOUT = 240000;

const server = new Protocol(PORT, HOST);

server.on('connection', (socket) => {
    socket.setTimeout(TIMEOUT); // [config] 4 minutes of inactivity
    // [log / debug]
    console.log(`New client connected ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('end', () => {
        console.log("Closing connection with the client: ", socket.address());
    })

    socket.on('data', chunk => {
        // [log / debug]
        //console.log(`${new Date()} [${chunk.length}] "${chunk.toString('ascii')}"`);

        socket._chunk = chunk; // by debug
        socket.emit('parse', chunk);
    })

    socket.on('parse', (chunk) => {
        try {
            const frame = new Frame(chunk);
            switch (frame.cmd) {
                case 'V1':
                    socket.emit('decode', frame.entries);
                    break;
                case 'HTBT':
                case 'V0':
                default:
                    socket.emit('echo', chunk, frame.entries);
                    return;
            }
        } catch (error) {
            socket.destroy(error);
        }
    })

    socket.on('decode', (entries) => {
        console.log(entries);
    })

    socket.on('echo', (message, entries) => {
        console.log(entries);
        socket.write(message);
    })

    socket.on('error', err => {
        console.log('*********************************************************');
        console.log('CHUNK:', socket._chunk.toString('ascii'));
        console.error(`Socket ${socket.remoteAddress}:${socket.remotePort}, ${err}`);
        console.log('STACK:');
        console.error(err.stack);
        console.log('STACK:');
        console.error(new Error().stack);
        console.log('*********************************************************');
    });

    socket.on('timeout', () => {
        console.log(`Socket timeout: ${socket.remoteAddress}:${socket.remotePort}`);
        socket.end();
    });
})
