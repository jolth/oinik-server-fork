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

const { createServer, Server } = require('node:net');

const HOST = "0.0.0.0"; 
const PORT = 7011;
let counter = 0;

//const server = new Server();
const server = createServer();

server.on('connection', socket => {
    socket.id = counter++;
    console.log(`New client connected ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', chunk => {
        const chunkLength = chunk.length;

        console.log(`${new Date()} [${chunkLength}] "${chunk.toString()}"`);

        if (chunkLength === 25) {
            //socket.pipe(socket);
            socket.write(chunk);
        }
    })

    socket.on('end', () => {
        console.log("Closing connection with the client: ", socket.address());
    })
})

server.listen(PORT, HOST, () => {
    //console.log(`Server running`);
    console.log(`${new Date()} listening [${server.listening}] port [${server.address().port}].`);
})
