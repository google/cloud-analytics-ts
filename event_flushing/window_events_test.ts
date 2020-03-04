/**
 * @fileoverview Test for Document Events Handler
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
import {WindowsEventsFlushingStrategy} from './window_events';

describe('WindowsEventsFlushingStrategy', () => {
  let windowHandler : WindowsEventsFlushingStrategy;
  let mockflushEventsDelegate : () => void;

  beforeEach(() => {
    windowHandler = new WindowsEventsFlushingStrategy();
    mockflushEventsDelegate = jasmine.createSpy('flushEventsDelegate');
  });

  describe('startBatching', () => {
    beforeEach(() => {
      spyOn(window, 'addEventListener');
    });

    it('should add beforeunload listener', () => {
      windowHandler.startBatching(mockflushEventsDelegate);
      expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', mockflushEventsDelegate);
    });

    it('should add unload listener', () => {
      windowHandler.startBatching(mockflushEventsDelegate);
      expect(window.addEventListener).toHaveBeenCalledWith('unload', mockflushEventsDelegate);
    });
  });

  describe('stopBatching', () => {
    beforeEach(() => {
      spyOn(window, 'removeEventListener');
    });

    it('should remove beforeunload listener', () => {
      windowHandler.stopBatching(mockflushEventsDelegate);
      expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', mockflushEventsDelegate);
    });

    it('should remove unload listener', () => {
      windowHandler.stopBatching(mockflushEventsDelegate);
      expect(window.removeEventListener).toHaveBeenCalledWith('unload', mockflushEventsDelegate);
    });
  });
});

