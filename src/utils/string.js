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
 * Creates an array of elements split into groups the length of `size`.
 *
 * strSizeSplit("020424", 2);
 * // => [ "02", "04", "24" ]
 * strSizeSplit("020424", 3);
 * // => [ "020", "424" ] 
 * strSizeSplit("020424", 4);
 * // => [ "0204" ]
 */
export function strSizeSplit(str, size) {
  return str.split("").map((_, i) => {
    i++;
    if (i % size == 0) return str.substring(i-size, i);
  }).filter(v => v);
}
