/**
 * @fileoverview Test for Cloud Analytics.
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
import {ClientType, DeviceType} from '../client_info';
import {CloudAnalyticsImplementation} from './cloud_analytics';
import {LogRequestTransmitter} from '../network/log_request_transmitter';

describe('CloudAnalytics', () => {
  let logRequestTransmitter: jasmine.SpyObj<LogRequestTransmitter>;
  let cloudAnalytics : CloudAnalyticsImplementation;

  const concordEvent = {
    type: 'testType',
    name: 'testName',
    projectNumber: '1234567890',
    latency: 123,
    metadata: [
      {key: 'test1', value: 'data1'},
      {key: 'test2', value: 'data2'},
    ],
    userSessionId: 'ABCDEFG',
  };

  beforeEach(() => {
    logRequestTransmitter = jasmine.createSpyObj('LogRequestTransmitter', ['sendRequest']);
    cloudAnalytics = new CloudAnalyticsImplementation(
        'TEST',
        {
          clientType: ClientType.JS,
          jsClientInfo: {deviceType: DeviceType.DESKTOP},
        },
        logRequestTransmitter, []);
  });

  describe('logEvent', () => {
    it('called sendMetricsFn', function() {
      cloudAnalytics.logEvent(concordEvent);

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalled();
    });

    it('has correct clientInfo', function() {
      cloudAnalytics.logEvent(concordEvent);

      const clientInfo = {
        client_type: 'JS',
        js_client_info: {device_type: 'DESKTOP'},
      };

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({client_info : clientInfo}));
    });

    it('has correct log source name', function() {
      cloudAnalytics.logEvent(concordEvent);

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({log_source_name: 'CONCORD'}));
    });

    it('has correct concordEvent', function() {
      cloudAnalytics.logEvent(concordEvent);

      const expectedTransformedConcordEvent = {
        console_type: 'TEST',
        event_type: 'testType',
        event_name: 'testName',
        event_metadata: [
          {key: 'test1', value: 'data1'},
          {key: 'test2', value: 'data2'},
        ],
        project_number: '1234567890',
        latency_ms: 123,
        browser_window_id: 'ABCDEFG',
      };

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({
        log_event: [jasmine.objectContaining({
          source_extension_json: JSON.stringify(expectedTransformedConcordEvent)
        })]
      }));
    });
  });

  describe('logSurveyResponse', () => {
    const surveyResponse = {
      projectNumber: '1234567890',
      userSessionId: 'ABCDEFG',
      metadata: {
        siteId: 'testSite',
        siteName: 'testSiteName',
        surveyId: 'testSurvey',
        surveyInstanceId: 'XYZ',
      },
      multipleChoiceResponses: [{
        questionNumber: 1,
        orderIndex: [1, 2, 3],
        answerIndex: [1, 2, 3],
        answerText: ['a', 'b', 'c'],
        order: [1, 2, 3],
      }],
      ratingResponses: [{
        questionNumber: 2,
        rating: 100,
      }],
      openTextResponses: [{
        questionNumber: 3,
        answerText: 'ABC',
      }],
    };

    it('called sendMetricsFn', function() {
      cloudAnalytics.logSurveyResponse(surveyResponse);

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalled();
    });

    it('has correct clientInfo', function() {
      cloudAnalytics.logSurveyResponse(surveyResponse);

      const clientInfo = {
        client_type: 'JS',
        js_client_info: {device_type: 'DESKTOP'},
      };

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({client_info: clientInfo}));
    });

    it('has correct log source name', function() {
      cloudAnalytics.logSurveyResponse(surveyResponse);

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({log_source_name: 'CONCORD'}));
    });


    it('has correct concordEvent', function() {
      cloudAnalytics.logSurveyResponse(surveyResponse);

      const hatsResponse = {
        hats_metadata: {
          site_id: 'testSite',
          site_name: 'testSiteName',
          survey_id: 'testSurvey',
          survey_instance_id: 'XYZ',
        },
        multiple_choice_response: [{
          question_number: 1,
          order_index: [1, 2, 3],
          answer_index: [1, 2, 3],
          answer_text: ['a', 'b', 'c'],
          order: [1, 2, 3],
        }],
        rating_response: [{
          question_number: 2,
          rating: 100,
        }],
        open_text_response: [{
          question_number: 3,
          answer_text: 'ABC',
        }],
      };

      const concordEvent = {
        console_type: 'TEST',
        event_type: 'hatsSurvey',
        event_name: 'surveyResponse',
        project_number: '1234567890',
        browser_window_id: 'ABCDEFG',
        hats_response: hatsResponse,
      };

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({
        log_event: [jasmine.objectContaining({
          source_extension_json: JSON.stringify(concordEvent)
        })]
      }));
    });

    it('should populate source_extension_json', () => {
      const cloudAnalytics = new CloudAnalyticsImplementation(
          'TEST',
{
            clientType: ClientType.JS,
            jsClientInfo: {deviceType: DeviceType.DESKTOP},
          },
          logRequestTransmitter, []);

      cloudAnalytics.logSurveyResponse({
        projectNumber: '1234567890',
        userSessionId: 'ABCDEFG',
        metadata: {
          siteId: 'testSite',
          siteName: 'testSiteName',
          surveyId: 'testSurvey',
          surveyInstanceId: 'XYZ',
        },
        multipleChoiceResponses: [{
          questionNumber: 1,
          orderIndex: [1, 2, 3],
          answerIndex: [1, 2, 3],
          answerText: ['a', 'b', 'c'],
          order: [1, 2, 3],
        }],
        ratingResponses: [{
          questionNumber: 2,
          rating: 100,
        }],
        openTextResponses: [{
          questionNumber: 3,
          answerText: 'ABC',
        }],
      });

      const hatsResponse = {
        hats_metadata: {
          site_id: 'testSite',
          site_name: 'testSiteName',
          survey_id: 'testSurvey',
          survey_instance_id: 'XYZ',
        },
        multiple_choice_response: [{
          question_number: 1,
          order_index: [1, 2, 3],
          answer_index: [1, 2, 3],
          answer_text: ['a', 'b', 'c'],
          order: [1, 2, 3],
        }],
        rating_response: [{
          question_number: 2,
          rating: 100,
        }],
        open_text_response: [{
          question_number: 3,
          answer_text: 'ABC',
        }],
      };

      const clientInfo = {
        client_type: 'JS',
        js_client_info: {device_type: 'DESKTOP'},
      };

      const concordEvent = {
        console_type: 'TEST',
        event_type: 'hatsSurvey',
        event_name: 'surveyResponse',
        project_number: '1234567890',
        browser_window_id: 'ABCDEFG',
        hats_response: hatsResponse,
      };

      expect(logRequestTransmitter.sendRequest).toHaveBeenCalledTimes(1);
      expect(logRequestTransmitter.sendRequest).toHaveBeenCalledWith(jasmine.objectContaining({
        log_source_name: 'CONCORD',
        client_info: clientInfo,
        log_event: [jasmine.objectContaining({
          source_extension_json: JSON.stringify(concordEvent)
        })]
      }));
    });
  });
});
