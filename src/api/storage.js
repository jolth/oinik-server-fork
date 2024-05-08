import config from "config";
import fetch from "node-fetch"; 
//import http from "node:http";

const storage = config.get("APIs.storage");
//const api = new URL(`${storage.protocol}://${storage.host}:${storage.port}`); 

/*
function getDevices() {
  api.pathname = "/devices";
  http.get(api, (res) => {

    let chunks = "";

    res.on("data", chunk => {
      chunks += chunk;
    });

    res.on("end", () => {
      try {
        const data = JSON.parse(chunks);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    });

  })
  .on("error", err => {
      console.log("ERROR", err);
  });
}
*/


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
 * It fecth all devices.
 */
export const getDevices = async () => {
  const uri = new URL(storage.pathname, 
    `${storage.protocol}://${storage.host}:${storage.port}`);

  try {
    const response = await fetch(uri);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
    // Loggin Error
    // Handling Error
    // Create StorageErro
    // Mirar si node-fetch toma el status 500 como error.
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
export const getDevice = async (key = {id, imei}) => {
  const uri = new URL(`${storage.protocol}://${storage.host}:${storage.port}`);
  uri.pathname = validateKey(key);

  try {
    const response = await fetch(uri);
    return await response.json();
  } catch (error) {
    throw error;
    // Loggin Error
    // Handling Error
    // Create StorageErro
    // Mirar si node-fetch toma el status 500 como error.
  }
};

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
export const updateDevice = async (key = {id, imei}, body = {} ) => {
  const uri = new URL(`${storage.protocol}://${storage.host}:${storage.port}`);
  uri.pathname = validateKey(key);

  try {
   const response = await fetch(uri, {
      method: "patch",
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    });
    return await response.json();
  } catch (error) {
    throw error;
    // Loggin Error
    // Handling Error
    // Create StorageErro
    // Mirar si node-fetch toma el status 500 como error.
  }
};




// TEST
//console.log(await getDevices());
//console.log(await getDevice({imei: 869731054158803}));
//console.log(await updateDevice({imei: 869731054158803}, {"last_connectz": "2024-05-08T19:40:46.000Z", "data_valid": true}));
