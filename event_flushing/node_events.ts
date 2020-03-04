/**
 * @fileoverview Event handler that flushes pending events for the process.
 *
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

import {BatchEventFlushingStrategy} from './batch_event_flushing_strategy';
import {on, off} from 'process';  // from //third_party/javascript/typings/node

/**
 * Event handler that flushes pending events for the process.
 */
export class NodeEventsFlushingStrategy implements BatchEventFlushingStrategy {
  startBatching(flushEventsDelegate: () => void): void {
    if (on) {
      on('beforeExit', flushEventsDelegate);
      on('SIGHUP', flushEventsDelegate);
    }
  }

  stopBatching(flushEventsDelegate: () => void): void {
    if(off) {
      off('beforeExit', flushEventsDelegate);
      off('SIGHUP', flushEventsDelegate);
    }
  }
}