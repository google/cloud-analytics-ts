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
import {request, RequestOptions} from 'https'; // from //third_party/javascript/typings/node

/**
 * Transmits log requests via Node's https module
 */
export class NodeLogRequestTransmitter implements LogRequestTransmitter {
  constructor(private readonly hostname : string,
              private readonly path: string,
              private readonly apiKey : string) {

  }

  sendRequest = (data: LogRequest) => {
    const postData = JSON.stringify(data);

    const options : RequestOptions = {
      host: this.hostname,
      port: 443,
      path: `/${this.path}/?key=${this.apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Content-Length' : postData.length
      }
    };
    const req = request(options);

    req.write(postData);
    req.end();
  };
}