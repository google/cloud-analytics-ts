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

import 'jasmine';

import {ClientType} from '../client_info';

import {NodeLogRequestTransmitter} from './node';
import {LogRequest} from './log_request';
import * as https from 'https'; // from //third_party/javascript/typings/node
import {ClientRequest} from 'http'; // from //third_party/javascript/typings/node

describe('NodeLogRequestTransmitter', () => {
  let requestTransmitter : NodeLogRequestTransmitter;
  let logRequest : LogRequest;
  let fakeClientRequest : jasmine.SpyObj<ClientRequest>;
  const loggingHostname = "test-endpoint";
  const loggingPath = "test/path";
  const apiKey = 'test';

  beforeEach(() => {
    fakeClientRequest = jasmine.createSpyObj('ClientRequest', ['write', 'end']);
    spyOn(https, 'request').and.returnValue(fakeClientRequest);
    requestTransmitter = new NodeLogRequestTransmitter(loggingHostname, loggingPath, apiKey);

    logRequest = {
      client_info: {client_type : ClientType.DESKTOP},
      log_source_name : 'TEST',
      request_time_ms: 1234,
      log_event : [{event_time_ms: 1234, source_extension_json: ''}]
    };
  });

  it('should open request as POST with specified logging endpoint', () => {
    requestTransmitter.sendRequest(logRequest);

    expect(https.request).toHaveBeenCalledWith(jasmine.objectContaining({
      host: loggingHostname,
      method: 'POST',
      port:443,
      path: `/${loggingPath}/?key=${apiKey}`,
      headers: jasmine.objectContaining({
        'Content-Type' : 'application/json'
      })
    }));
  });

  it('should send log request in payload', () => {
    requestTransmitter.sendRequest(logRequest);

    expect(fakeClientRequest.write).toHaveBeenCalledWith(JSON.stringify(logRequest));
  });
});