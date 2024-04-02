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
"use strict";

import net from "node:net";

class Protocol extends net.Server {
    constructor(port, host="0.0.0.0", option) {
        super(option);
        this._port = port;
        this._host = host;

        this.listen(this._port, this._host, () => {
            console.log(`${new Date().toString()} Protocol listening ${this.address().address}:${this.address().port}`);
        });
    }
};

export {
    Protocol
};

//const protocol = new Protocol(10101, "127.0.0.1", 240000);
//protocol.on("connection", (socks) => {
//    console.log(protocol._timeout);
//})

