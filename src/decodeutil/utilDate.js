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
//import {format} from "date-fns/esm";
import {format, parse} from "date-fns";

/**
 * Converting (formatting) 2-digit year to a 4-digit date.
 *
 */
//function dateYear2To4Digit(dateString, formatString) {
//    return parse(dateString, formatString, new Date());
//}


/**
 * The date time string format, a simplification of the ISO 8601 format.
 *
 *   Name	         Type	   Description
 *  dateString	  String	the string to parse
 *  formatString	String	the string of tokens
 *
 * If formatString matches with dateString. return a ISO8601 with UTC-0.
 *     YYYY-MM-DDTHH:mm:ss.000Z
 */
//function dateISO8601(year, month, day, hour, minute, second, ) {
export function dateISO8601(dateString, formatString) {
  //const yearRegex = /(yy)/ig;
  const iso861format = "yyyy-MM-dd'T'HH:mm:ss";

  if (dateString.length !== formatString.length) {
    const errMessage = `The format string "${formatString}" does not match the date string "${dateString}".`;
    throw new TypeError(errMessage);
  }

  return `${format(parse(dateString, formatString, new Date()), iso861format)}.000Z`;
  //if (formatString.match(yearRegex).length === 1) {
  //return `${format(dateYear2To4Digit(dateString, formatString), iso861format)}.000Z`;
  //}
  //return `${format(dateString, iso861format)}.000Z`;
} 

//let dateString = "03-04-24 22:52:43";
//let formatString = "dd-MM-yy HH:mm:ss";
//let dateString = "03-04-2024 22:52:43";
//let formatString = "dd-MM-yyyy HH:mm:ss";
//console.log(dateYear2To4Digit(dateString, formatString));
//console.log(dateISO8601(dateString, formatString));
