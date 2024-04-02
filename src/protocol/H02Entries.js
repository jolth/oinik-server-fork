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

import { Entries } from "./BaseEntries.js";

class H02Entries extends Entries {
    constructor(entrie, opts) {
        super(opts);

        this._entrie = entrie;
        
        process.nextTick(() => {
            this._decode();
        });
    }

    get id() {
        return this._entrie.imei;
    }

    _decode() {
        this.emit("decoded", this.id);
    }
}

export {
    H02Entries
};


// test:
const entrie = {
    header: "*HQ",
    imei: "869731054158803",
    cmd: "V1",
    time: "173742",
    dataValid: "A",
    lat: "0502.30921",
    latSymbol: "N",
    lon: "07527.54226",
    lonSymbol: "W",
    speed: "000.00",
    azimuth: "268",
    date: "290324",
    equ_status: "FFFFFFFF",
    datetimeArrival: new Date("2024-03-29T17:37:43.943Z")
};

const h02 = new H02Entries(entrie);

h02.on("error", (err) => {
    console.error(err);
});

h02.on("decoded", (data) => {
    console.log(data);
});
