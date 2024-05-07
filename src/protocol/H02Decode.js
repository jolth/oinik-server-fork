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
import { Entries } from "./BaseDecode.js";
import { strSizeSplit } from "../decodeutil/utilities.js";
import { dateISO8601 } from "../decodeutil/utilDate.js";

class H02Entries extends Entries {
  constructor(entries, opts) {
    super(opts);

    this._entries = entries;

    process.nextTick(() => {
      this._decode();
    });
  }

  get id() {
    return this._entries.imei;
  }

  _decode() {
    this._entries["dateISO8601UTC0"] = this._dateISO8601(this._entries.date,
      this._entries.time);
    this._entries["alerts"] = this._equ_status("0x" + this._entries.equ_status);

    this.emit("decoded", this._entries);
  }

  _dateISO8601(date, time) {
    const [day, month, year] = strSizeSplit(date, 2);
    const [hour, minute, second] = strSizeSplit(time, 2);

    return dateISO8601(`${day}-${month}-${year} ${hour}:${minute}:${second}`,
      "dd-MM-yy HH:mm:ss");
  }

  _equ_status(hexStatus) {
    const alerts = {
      hexStatus,
    };

    for (let bit=0; bit < 32; bit++) { // 4 Bytes (32-bit)
      const mask = 1 << bit;  // (1 << 0) 1-byte is 00000001
      //console.log(`bit[${bit}]: ${(hexStatus & mask) === 0} - ${mask.toString(2)}`);

      //ESTE ES
      if ((hexStatus & mask) !== 0) { // bit ON (1)
        //console.log(`bit[${bit}] - ${table[bit]} : 1`);
        //events[statusAndEventsShort[bit]] = "1";
        alerts[bit] = `${statusAndEventsShort[bit]} : 1`;
      } else { // bit OFF (0)
        //console.log(`bit[${bit}] - ${table[bit]} : 0`);
        //events[statusAndEventsShort[bit]] = "0";
        alerts[bit] = `${statusAndEventsShort[bit]} : 0`;
      }

      /*
       if (bit === 1) {
         if ((hexStatus & mask) === 0) {
           console.log("Movement Alarm");
         }
       }

       if (bit === 2) {
       }

       if (bit === 10) { // 10th bit ACC '10000000000'
         if ((hexStatus & mask) !== 0) {
           console.log("ACC ON");
         } else {
           console.log("ACC OFF");
         }
       } 

       if (bit === 18) { // 18th bit SOS Alarm 
         if ((hexStatus & mask) === 0) {
           console.log("SOS Alarm");
         }
       }

      */

      /*
      switch ((hexStatus & mask)) {
        case 0:
          if (bit === 9) { // 9th bit 
            events[bit] = `${statusAndEventsShort[bit]}: ${0}`;
          } else if (bit === 10) { // 10th bit ACC OFF '00000000000
            events[bit] = `${statusAndEventsShort[bit]}: ${0}`;
          } else if (bit === 27) { // 27th bit 
            events[bit] = `${statusAndEventsShort[bit]}: ${0}`;
          } else {
            events[bit] = `${statusAndEventsShort[bit]}: ${0}`;
          }
          break;
        default: // 0xFF = 11111111 
          if (bit === 9) { // 9th bit 
            events[bit] = `${statusAndEventsShort[bit]}: ${1}`;
          } else if (bit === 10) { // 10th bit ACC ON '10000000000
            events[bit] = `${statusAndEventsShort[bit]}: ${1}`;
          } else if (bit === 27) { // 27th bit 
            events[bit] = `${statusAndEventsShort[bit]}: ${1}`;
          } else {
            //events[bit] = `${statusAndEventsShort[bit]}: ${0}`;
          }
          break;
      }
      */

      //if ((hexStatus & mask) === 0) {
      //  // bit active:
      //  //console.log(statusAndEventsShort[bit]);
      //  //console.log(statusAndEventsShort[bit], mask.toString(2));
      //  //console.log(bit);
      //  //events[bit] = statusAndEventsShort[bit];
      //}
    }
    return alerts;
  }
}

const statusAndEventsShort = {
  0: "",
  1: "Movement alarm",
  2: "Over speeding alarm",
  3: "",
  4: "Fence-inalarm",
  5: "Fatigue driving alarm",
  6: "Harsh braking",
  7: "Fence-outalarm",
  8: "",
  9: "Arm(0)/Disarm(1)condition",                          // Arm(0)/Disarm(1)condition
  10: "(0) ACC off, (1)ACC on",                            // (0) ACC off, (1)ACC on
  11: "Vibration alarm",
  12: "Low battery alarm",
  13: "Sharp Turning",
  14: "Harsh acceleration",
  15: "",
  16: "",
  17: "",
  18: "SOS Alarm",
  19: "Device powered by the backup battery",
  20: "External power disconnected status",
  21: "",
  22: "ACC ON alarm",
  23: "ACC OFF alarm",
  24: "",
  25: "",
  26: "Removal alarm",
  27: "(0) Cut fuel status, (1)resume fuel status",
  28: "Power cut alarm",
  29: "",
  30: "",
  31: "",
};

export {
  H02Entries
};

/*
 * TEST 
 */
/*
const entries = {
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
  equ_status: "E3238109",
  //equ_status: "FFFFFBFF",
  //equ_status: "FFFFFFFF",
  datetimeArrival: new Date("2024-03-29T17:37:43.943Z")
};

const h02 = new H02Entries(entries);

h02.on("error", (err) => {
  console.error(err);
});

h02.on("decoded", (status) => {
  console.log(status);
});
*/
