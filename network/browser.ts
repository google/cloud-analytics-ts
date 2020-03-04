/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {LogRequest} from './log_request';
import {LogRequestTransmitter} from './log_request_transmitter';

/**
 * Transmits log requests via XMLHttpRequest which is only available in browser
 * environments.
 */
export class BrowserLogRequestTransmitter implements LogRequestTransmitter {
  constructor(private readonly loggingEndpoint : string) {

  }

  sendRequest = (data: LogRequest) => {
    const http = new XMLHttpRequest();
    http.open('POST', this.loggingEndpoint);
    http.setRequestHeader('Content-Type', 'application/json');

    try {
      const payload = JSON.stringify(data);
      http.send(payload);
    } catch(error) {
    }
  };
}