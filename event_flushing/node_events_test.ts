/**
 * @fileoverview Test for Node Events Handler
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

import 'jasmine';
import {NodeEventsFlushingStrategy } from './node_events';
import * as process from 'process';  // from //third_party/javascript/typings/node

describe('NodeEventsFlushingStrategy', () => {
  let nodeEventsFlushingStrategy : NodeEventsFlushingStrategy;
  let mockflushEventsDelegate : () => void;

  beforeAll(() => {
    nodeEventsFlushingStrategy = new NodeEventsFlushingStrategy();
    mockflushEventsDelegate = jasmine.createSpy('flushEventsDelegate');
  });

  describe('startBatching', () => {
    beforeEach(() => {
      spyOn(process, 'on');
      nodeEventsFlushingStrategy.startBatching(mockflushEventsDelegate);
    });

    it('should add beforeExit listener', () => {
      expect(process.on).toHaveBeenCalledWith('beforeExit', mockflushEventsDelegate);
    });

    it('should add SIGHUP listener', () => {
      expect(process.on).toHaveBeenCalledWith('SIGHUP', mockflushEventsDelegate);
    });
  });

  describe('stopBatching', () => {
    beforeEach(() => {
      spyOn(process, 'off');
      nodeEventsFlushingStrategy.stopBatching(mockflushEventsDelegate);
    });

    it('should remove beforeExit listener', () => {
      expect(process.off).toHaveBeenCalledWith('beforeExit', mockflushEventsDelegate);
    });

    it('should remove SIGHUP listener', () => {
      expect(process.off).toHaveBeenCalledWith('SIGHUP', mockflushEventsDelegate);
    });
  });
});