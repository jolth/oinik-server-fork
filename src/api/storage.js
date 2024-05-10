import config from "config";
import http from "node:http";

const storage = config.get("APIs.storage");

/*
 * Receives the "key" object to which an "id" or "imei" and
 * return the pathname appropiate.
 */
const validateKey = (key = {id, imei}) => {
  if ("id" in key) {
    return `${storage.pathname}/id/${key.id}`;
  }

  if ("imei" in key) {
    return `${storage.pathname}/imei/${key.imei}`;
  }
};


/*
 * Method: GET
 * Receives the "key" object to which an "id" or "imei" must be specified.
 *   
 *   await getDevice({imei: 869731054158803});
 * 
 *   // Expected output: { "response": {"id": 1198, ... }
 */
/*
export const getDevice = async (key = {id, imei}) => {
  const uri = new URL(`${storage.protocol}://${storage.host}:${storage.port}`);
  uri.pathname = validateKey(key);

  try {
    const response = await fetch(uri);
    return await response.json();
  } catch (error) {
    console.error("******************* ERROR: ");
    console.error(error);
    //throw error;
    //throw error;
    // Loggin Error
    // Handling Error
    // Create StorageErro
    // Mirar si node-fetch toma el status 500 como error.
  }
};
*/



/*
 * Method: GET
 * It fecth all devices.
 */
export function getDevices() {
  const uri = new URL(storage.pathname, 
    `${storage.protocol}://${storage.host}:${storage.port}`);

  return http.get(uri, function(res) {
    let chunks = "";

    res.on("data", chunk => {
      chunks += chunk;
    });

    res.on("end", () => {
      try {
        const data = JSON.parse(chunks);
        this.emit("result", data);
      } catch (error) {
        console.error(error);
      }
    });
  })
  .on("error", err => {
      console.log("ERROR getDevicesE", err);
  });
}

//const devices = getDevicesE();
//
//devices.on("result", (data) => {
//  console.log(data);
//});

/*
 * Method: PATCH
 * Receives the "key" object to which an "id" or "imei" must be specified,
 * also receives the "body" object with the column(s) to update.
 *   
 *   await updateDevice({imei: 869731054158803}, 
 *   {"last_connectz": "2024-05-08T19:40:46.000Z", "data_valid": true});
 *
 *   // Expected output: { response: 1 }
 *
 */
//export function updateDevice(key={id, imei}, body={}) {
export function updateDevice(key={id, imei}) {
  const uri = new URL(`${storage.protocol}://${storage.host}:${storage.port}`);
  uri.pathname = validateKey(key);

  //const data = JSON.stringify(body);
  const options = {
   // hostname: storage.host,
   // port: storage.port,
   // path: validateKey(key),
    method: "PATCH",
    headers: {
    "Content-Type": "application/json",
    //"Content-Length": Buffer.byteLength(data),
    },
  };

  return http.request(uri, options, function(res) {
    res.setEncoding("utf8");

    let chunks = "";

    res.on("data", (chunk) => {
      chunks += chunk;
    });

    res.on("end", () => {
      if (!res.complete) {
        //throw new Error(`The connection finish while the message ${data} was still beig sent`);
        console.log(`The connection finish while the message ${data} was still beig sent`);
      }

      try {
        const response = JSON.parse(chunks);
        this.emit("result", response);
       } catch (error) {
        //throw new Error(`Error response updateDevice: ${error.message}`);
        console.log(`Error response updateDevice: ${error.message}`);
      }
    });
  });

  /*
    .on("error", (error) => {
    throw new Error(`problem with request updateDevice: ${error.message}`);
  });
  */

  //req.write(data);
  //req.end();
} 

//const update = updateDevice({imei: 869731054158803});
//const data = JSON.stringify({"last_connectz": new Date(), "data_valid": true});
//
//update.write(data);
//update.end();
//
//update.on("result", (res) => {
//  console.log(res);
//});





// TES
//console.log(getDevicesEvent());
//console.log(await getDevices());
//console.log(await getDevice({imei: 869731054158803}));
//console.log(await updateDevice({imei: 869731054158803}, {"last_connectz": "2024-05-08T19:40:46.000Z", "data_valid": true}));
//console.log(await updateDevice({imei: 869731054158803}, {"last_connectz": "2024-05-08T19:40:46.000Z", "data_valid": true}));
//updateDevice({imei: 869731054158803}, {"last_connectz": new Date(), "data_valid": true});
