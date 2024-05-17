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
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const END = 0x23;

const jsonFormat = JSON.parse(
  readFileSync(path.join(__dirname, "H02Format.json"))
);

class Frame {
  constructor(chunk) {
    this._mem = this._split(chunk, ",");
  }

  _parse(chunk) {
    if (chunk[chunk.length - 1] === END) {
      return chunk.subarray(0, chunk.length - 1);
    } else {
      throw new Error("The packet is not an h02 protocol");
    }
  }

  _split(chunk, separator, encoding="ascii") {
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
    if (this.cmd in jsonFormat.formats) {
      const entries = Object.fromEntries(
        this._mem.map((e, i) => [jsonFormat.formats[cmd][i], e])
      );
      entries["datetimeArrival"] = new Date();
      entries["dataValid"] = entries["dataValid"] === "A" ? true : false;
      return entries;
    } else {
      const entries = Object.fromEntries(
        this._mem.map((e, i) => [jsonFormat.formats["BASE"]?.[i] || `para${i-2}`, e])
      );
      entries["datetimeArrival"] = new Date();
      return entries;
    }
  }
}

export {
  Frame 
};

//const e1 = new Frame(Buffer.from("*HQ,869731054158803,HTBT#"));
//const e2 = new Frame(Buffer.from("*HQ,869731054158803,V1,145655,A,0502.30446,N,07527.53997,W,000.00,135,160324,FFFFFBFF#"));
//const e3 = new Frame(Buffer.from("*HQ,869731054158803,TIME#"));
//const e4 = new Frame(Buffer.from("*HQ,869731054158803,ICCID,89571016025059771124#"));
//const e = [e1,e2,e3,e4];
//e.forEach(e => console.log(e.cmd, e.entries));
