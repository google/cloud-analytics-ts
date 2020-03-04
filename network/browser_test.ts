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

import {BrowserLogRequestTransmitter} from './browser';
import {LogRequest} from './log_request';

describe('BrowserLogRequestTransmitter', () => {
  let requestTransmitter : BrowserLogRequestTransmitter;
  let logRequest : LogRequest;
  const loggingEndpoint = "http://test-endpoint";

  beforeEach(() => {
    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
    spyOn(XMLHttpRequest.prototype, 'send');

    requestTransmitter = new BrowserLogRequestTransmitter(loggingEndpoint);
    logRequest = {
      client_info: {client_type : ClientType.DESKTOP},
      log_source_name : 'TEST',
      request_time_ms: 1234,
      log_event : [{event_time_ms: 1234, source_extension_json: ''}]
    };
  });

  it('should open request as POST with specified logging endpoint', () => {
    requestTransmitter.sendRequest(logRequest);

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', loggingEndpoint);
  });

  it('should send JSON stringified log request as payload', () => {
    requestTransmitter.sendRequest(logRequest);

    const expectedPayload = JSON.stringify(logRequest);

    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith(expectedPayload);
  });
});