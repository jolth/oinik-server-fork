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
import { Protocol } from "./BaseProtocol.js";
import { Frame } from "./H02Parse.js";
import { H02Entries } from "./H02Decode.js";
import logger from "../logger.js";
import config from "config";
import * as storage from "../api/storage.js";

const h02Config = config.get("Protocols.h02");

const HOST = h02Config.host; // "0.0.0.0"
const PORT = h02Config.port; // 17011
const TIMEOUT = h02Config.timeout; // 360000

const server = new Protocol(PORT, HOST);

server.on("connection", (socket) => {
  socket.setTimeout(TIMEOUT); // [config] 6 minutes of inactivity
  // [log / debug]
  //console.log(`New client connected ${socket.remoteAddress}:${socket.remotePort}`);
  logger.info(`New client connected ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on("end", () => {
    console.log("Closing connection with the client: ", socket.address());
  });

  socket.on("data", chunk => {
    // [log / debug]
    //console.log(`${new Date()} [${chunk.length}] "${chunk.toString("ascii")}"`);
    logger.info(`${new Date()} [${chunk.length}] "${chunk.toString("ascii")}"`);

    socket._chunk = chunk; // by debug
    socket.emit("parse", chunk);
  });

  socket.on("parse", (chunk) => {
    try {
      const frame = new Frame(chunk);
      switch (frame.cmd) {
        case "V1":
          if (!frame.entries.dataValid) {
            // Save IMEI connection
            // Save hexStatus of invalidConnection
            // invalidConnection - It could arrive as cached data on the device.
            socket.emit("store", "invalidConnection", frame.entries);
          }

          socket.emit("decode", frame.entries);

          return;
        case "HTBT":
        case "V0":
        default:
          //socket.emit("echo", chunk, frame.entries);
          socket.emit("echo", chunk);
          // Save IMEI connection
          socket.emit("store", "heartbeatConnection", frame.entries); // heartbeat
          return;
      }
    } catch (error) {
      socket.destroy(error);
    }
  });

  socket.on("decode", (entries) => {
    const h02 = new H02Entries(entries);

    h02.on("error", (err) => {
      console.error(err);
      //socket.emit("error", err);
    });

    h02.on("decoded", (status) => {
      console.log(status);
    });
  });

  socket.on("echo", (message) => {
    //socket.on("echo", (message, entries) => {
    //console.log("ECHO");
    //console.log(entries);
    socket.write(message);
  });

  socket.on("store", (type, entries) => {

    const typeStorage = {
      "heartbeatConnection": storage.updateDevice,
      "position": null,
      "invalidConnection": null
    };

    const store = typeStorage[type]({ imei: entries.imei });
    store.write(JSON.stringify({ last_connectz: entries.datetimeArrival }));
    store.end();

    store.on("error", (err) => {
      socket.emit("error", err);
    });


    /*
    const typeStorage = {
      "heartbeatConnection": storage.updateDevice,
      "position": null,
    };

    try {
      const key = {
        imei: entries.imei
      };
      const body = {
        last_connectz: entries.datetimeArrival
      };
      typeStorage[type](key, body);
      //typeStorage[type]( { imei: entries.imei },
      //  { last_connectz: entries.datetimeArrival } );
    } catch (error) {
      // Mejorar esto
      console.error("ERROR IN Storage Socket");
      socket.emit("error", error);
    }
    */

    //if (type) {
    //  console.log(`stores POSITION: ${entries}`);
    //} else {
    //  console.log(`stores CONNECTION: [${entries.imei}, ${entries.datetimeArrival}]`);
    //}
  });

  socket.on("error", err => {
    console.log("*********************************************************");
    console.log("CHUNK:", socket._chunk.toString("ascii"));
    console.error(`Socket ${socket.remoteAddress}:${socket.remotePort}, ${err}`);
    console.log("STACK:");
    console.error(err.stack);
    console.log("STACK:");
    console.error(new Error().stack);
    console.log("*********************************************************");

    logger.error("*********************************************************");
    logger.error(`Socket ${socket.remoteAddress}:${socket.remotePort}, ${err}`);
    logger.error("CHUNK:", socket._chunk.toString("ascii"));
    logger.error(err.stack);
    logger.error(new Error().stack);
    logger.error("*********************************************************");

  });

  socket.on("timeout", () => {
    //console.log(`Socket timeout: ${socket.remoteAddress}:${socket.remotePort}`);
    logger.info(`Socket timeout: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.end();
  });
});
