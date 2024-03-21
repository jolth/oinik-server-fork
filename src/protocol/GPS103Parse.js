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
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const END = 0x3b;

const jsonFormat = JSON.parse(
    readFileSync(join(__dirname, 'GPS103Format.json'))
);

class Entries {
    constructor(chunk) {
        this._mem = this._split(chunk, ',');
    }

    _parse(chunk) {
        if (chunk[chunk.length - 1] === END) {
            return chunk.subarray(0, chunk.length - 1);
        } else {
            throw new Error('The packet is not an GPS103 protocol');
        }
    }

    _split(chunk, separator, encoding='ascii') {
        return this._parse(chunk)
            .toString(encoding)
            .split(separator);
    }

    get cmd() {
        switch (this._mem.length) {
            case 1: // Heartbeat
                return 'HTBT';
            case 3: // Device Login
                return this._mem[2];
            case 10: // status
                //return 'STATUS';
                return this._mem[1];
            default: // Device Message
                //return this._mem[1];
                return 'PROTOCOL18';
        }
    }

    get entries() {
        return this._entries(this.cmd);
    }

    _entries(cmd) {
        if (this.cmd in jsonFormat.formats) {
            return Object.fromEntries(
                this._mem.map((e, i) => [jsonFormat.formats[cmd]?.[i], e])
            );
        } else {
            return Object.fromEntries(
                this._mem.map((e, i) => [`para${i+1}`, e])
            );
        }
    }
}

module.exports = {
    Entries
}

//const e1 = new Entries(Buffer.from("##,imei:864035051888395,A;"))
//const e2 = new Entries(Buffer.from("imei:864035051888395,status,120,0,0,0,0,0,0.00,1;"))
//const e3 = new Entries(Buffer.from("864035051888395;"))
//const e4 = new Entries(Buffer.from("imei:864035051888395,tracker,240319175704,,L,,,714f,,aab67c8,,,;"))
//const e5 = new Entries(Buffer.from("imei:864035051888395,tracker,240319182233,,F,182233.000,A,0502.30139,N,07527.53972,W,6.55,46.88;"))
//const e6 = new Entries(Buffer.from("imei:864035051888395,tracker,240319183026,,L,,,714f,,aab67c8,,,,,0,0,0.00%,,;"))
//const e7 = new Entries(Buffer.from("imei:864035051888395,tracker,240319184738,,F,184738.000,A,0502.29946,N,07527.53964,W,6.43,171.11,,0,0,0.00%,,;"))
//const t = [e1,e2,e3,e4,e5,e6,e7]
//t.forEach((e) => console.log(e._mem.length, e._mem))
//t.forEach((e) => console.log(e.cmd))
//t.forEach((e) => console.log(e.entries))
