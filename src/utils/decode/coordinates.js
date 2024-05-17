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
"use strict";

/**
 * Convert degrees minutes seconds To decimal degrees.
 *
 *    Name	         Type	   Description
 *  numberString    String  
 *  direction       String
 *
 * degreesMSToDDegrees("0502.30052", "N")
 * // => 5.038342
 * degreesMSToDDegrees("07527.54730", "W")
 * // => -75.45912166666666
 *   
 */
export function degreesMSToDDegrees(numberString, direction) {
  const offset = numberString.indexOf(".");
  let d = numberString.slice(0, offset - 2);
  let m = numberString.slice(offset - 2);
  m = parseFloat(m) / 60;
  const number = parseFloat(d) + m;
  if (direction === "S" || direction === "W") return number * (-1);
  return number;
}

// TEST
//[
//  ["0502.30052", "N"],
//  ["07527.54730", "W"]
//].forEach((d) => console.log(degreesMSToDDegrees(...d)));
