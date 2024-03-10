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

const net = require('node:net');

const HOST = ''; // [config] host.
const PORT = 7011;

// [config] range of protocols port
//const protocolsPort = {
//    from: 10101,
//    to: 10110, 
//    next() {
//        if (this.current <= this.to) {
//            return {
//                done: false,
//                value: this.current++
//            };
//        } else {
//            return { done: true };
//        }
//    },
//    [Symbol.iterator]() {
//        this.current = this.from;
//        return this;
//    }
//};

const server = net.createServer(socket => {
    //socket.setEncoding('utf8');

    socket.setTimeout(240000); // [config] 4 minutes of inactivity
    // [log]
    socket.remoteAddPort = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Client connected ${socket.remoteAddPort}`);

    socket.on('data', (chunk) => {
        console.log(`${new Date()} [${chunk.length}] "${chunk.toString()}"`);

        // echo
        // Length of package for echo H02 protocol
        const LENGTHFORECHO = 25;
        if (chunk.length === LENGTHFORECHO) {
            socket.pipe(socket);
            return;
        }

        // valid data

    });

    socket.on('end', () => {
        console.log("Closing connection with the client: ", socket.address());
    });

    socket.on('error', (err) => {
        console.error(`Socket ${socket.remoteAddPort} Error: ${err}`);
        console.log('*******************');
        console.error(err.stack);
        console.log('*******************');
        console.error(new Error().stack);
    });

    socket.on('timeout', () => {
        console.log('socket timeout');
        socket.end();
    });

});

server.listen({port:PORT, host:HOST}, () => {
    console.log(`${new Date()} listening [${server.listening}] port [${server.address().port}].`);
});
