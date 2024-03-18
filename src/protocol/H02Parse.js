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

const jsonFormat = JSON.parse(
    readFileSync(join(__dirname, 'H02Format.json'))
);

class Entries {
    constructor(chunk) {
        this._mem = this._split(chunk, ',');
    }

    _parse(chunk) {
        if (chunk[chunk.length - 1] === 0x23) {
            return chunk.subarray(0, chunk.length - 1);
        } else {
            // bad
            throw new Error('The packet is not an h02 protocol');
        }
    }

    _split(chunk, separator, encoding='ascii') {
        return this._parse(chunk)
            .toString(encoding)
            .split(separator);
    }

    get cmd() {
        return this._mem[2];
    }

    get entries() {
        return this._entries(this.cmd);
    }

    _entries(cmd) {
        //return Object.entries(
        return Object.fromEntries(
            this._mem.map((e, i) => [jsonFormat.formats[cmd][i], e])
        );
    }
}

module.exports = {
    Entries
}

//const e = new Entries(Buffer.from("*HQ,869731054158803,HTBT#"));
//const e = new Entries(Buffer.from("*HQ,869731054158803,V1,145655,A,0502.30446,N,07527.53997,W,000.00,135,160324,FFFFFBFF#"));
//console.log(e.cmd);
//console.log(e.entries);
