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

import{ClientInfo, ClientType}from './client_info';

/** Production log server hostname */
export const LOGGING_ENDPOINT_HOSTNAME = 'firebaselogging-pa.googleapis.com';

/** Production log server logging path */
export const LOGGING_ENDPOINT_PATH = 'v1/firelog/legacy/log';

/** Production log server endpoint. */
export const LOGGING_ENDPOINT_BASE = `https://${LOGGING_ENDPOINT_HOSTNAME}/${LOGGING_ENDPOINT_PATH}`;

/** How frequently to flush log buffer. */
export const DEFAULT_FLUSH_INTERVAL_MS = 10000;

/** Minimal interval to flush log buffer. */
export const MIN_FLUSH_INTERVAL_MS = 1000;

/** Maximum interval to flush log buffer. */
export const MAX_FLUSH_INTERVAL_MS = 60000;

/** The log source name for the logs. */
export const LOG_SOURCE = 'CONCORD';

/** The default client info. */
export const DEFAULT_CLIENT_INFO : ClientInfo = {
  clientType: ClientType.JS
};