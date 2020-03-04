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


import {ClientInfo}from '../client_info';
import {CloudEvent} from '../cloud_event';
import {SurveyResponse} from '../survey_response';
import {ConcordEvent, LogEvent, LogRequest, HatsResponse, ClientInfo as FirelogClientInfo} from '../network/log_request';
import {BatchEventFlushingStrategy} from '../event_flushing/batch_event_flushing_strategy';
import {LogRequestTransmitter} from '../network/log_request_transmitter';
import {DEFAULT_FLUSH_INTERVAL_MS, MAX_FLUSH_INTERVAL_MS, MIN_FLUSH_INTERVAL_MS, LOG_SOURCE} from '../constants';

/**
 * Handles logging of events to Concord.
 */
export class CloudAnalyticsImplementation {
  private readonly pendingEvents: LogEvent[] = [];
  private isBatchMode: boolean = false;
  private flushIntervalMs: number;
  private flushInterval?: number;
  private readonly flushEventsDelegate: () => void;

  /**
   * The constructor of Cloud Analytics.
   *
   * @param consoleType The console type of the log.
   * @param clientInfo The client info about the device.
   * @param logRequestTransmitter The method of transmitting logs to the
   * back-end
   * @param flushingHandlers Event flushing handlers that dictate when events
   * should be flushed when batching is enabled.
   */
  constructor(private readonly consoleType: string,
              private readonly clientInfo: ClientInfo,
              private readonly logRequestTransmitter: LogRequestTransmitter,
              private readonly flushingHandlers: BatchEventFlushingStrategy[]) {
    this.flushIntervalMs = DEFAULT_FLUSH_INTERVAL_MS;
    this.flushEventsDelegate = () => {
      this.flushEvents();
    };
  }

  /**
   * Enable Cloud Analytics in batch mode which bundles multiple events.
   * @param flushIntervalMs the interval of flushing batched logs.
   */
  enableBatchMode(flushIntervalMs: number = DEFAULT_FLUSH_INTERVAL_MS) {
    this.flushIntervalMs = Math.max(Math.min(flushIntervalMs, MAX_FLUSH_INTERVAL_MS), MIN_FLUSH_INTERVAL_MS);
    this.isBatchMode = true;
  }

  /**
   * Logs the given event to Cloud Analytics.
   * @param event The event to log.
   */
  logEvent(event: CloudEvent) {
    const concordEvent : ConcordEvent = {
      'console_type': this.consoleType,
      'event_type': event.type,
      'event_name': event.name,
      'event_metadata': event.metadata,
      'project_number': event.projectNumber,
      'latency_ms': event.latency,
      'browser_window_id': event.userSessionId,
    };
    this.pushEvent(concordEvent);
  }

  /**
   * Logs the survey response to Cloud Analytics.
   * @param surveyResponse The survey response to log.
   */
  logSurveyResponse(surveyResponse: SurveyResponse) {
    const metadata = surveyResponse.metadata || {};
    const hatsResponse : HatsResponse = {
      'hats_metadata': {
        'site_id': metadata.siteId,
        'site_name': metadata.siteName,
        'survey_id': metadata.surveyId,
        'survey_instance_id': metadata.surveyInstanceId,
      },
    };
    if (surveyResponse.multipleChoiceResponses) {
      hatsResponse['multiple_choice_response'] = [];
      for (const multipleChoiceResponse of surveyResponse.multipleChoiceResponses) {
        hatsResponse['multiple_choice_response'].push({
          'question_number':multipleChoiceResponse.questionNumber,
          'order_index':multipleChoiceResponse.orderIndex,
          'answer_index':multipleChoiceResponse.answerIndex,
          'answer_text':multipleChoiceResponse.answerText,
          'order':multipleChoiceResponse.order
        });
      }
    }
    if (surveyResponse.ratingResponses) {
      hatsResponse['rating_response'] = [];
      for (const ratingResponse of surveyResponse.ratingResponses) {
        hatsResponse['rating_response'].push({
          'question_number':ratingResponse.questionNumber,
          'rating':ratingResponse.rating
        });
      }
    }
    if (surveyResponse.openTextResponses) {
      hatsResponse['open_text_response'] = [];
      for (const openTextResponse of surveyResponse.openTextResponses) {
        hatsResponse['open_text_response'].push({
          'question_number':openTextResponse.questionNumber,
          'answer_text':openTextResponse.answerText
        });
      }
    }
    const concordEvent : ConcordEvent = {
      'console_type':this.consoleType,
      'event_type':'hatsSurvey',
      'event_name':'surveyResponse',
      'project_number':surveyResponse.projectNumber,
      'browser_window_id':surveyResponse.userSessionId,
      'hats_response':hatsResponse
    };
    this.pushEvent(concordEvent);
  }

  /**
   * Flush the events manually.
   */
  flush() {
    this.flushEvents();
  }

  /**
   * Start the batch log pushing.
   */
  startBatching() {
    if (!this.isBatchMode) {
      return;
    }
    this.flushInterval = setInterval(this.flushEventsDelegate, this.flushIntervalMs);

    this.flushingHandlers.forEach((handler) => {
      handler.startBatching(this.flushEventsDelegate);
    });
  }

  /**
   * Stop the batch log pushing.
   */
  stopBatching() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    this.flushingHandlers.forEach((handler) => {
      handler.stopBatching(this.flushEventsDelegate);
    });

    this.flushEvents();
  }

  private pushEvent(concordEvent: ConcordEvent) {
    const logEvent : LogEvent = {'event_time_ms':(new Date()).getTime(), 'source_extension_json':JSON.stringify(concordEvent)};
    this.pendingEvents.push(logEvent);

    // Flush the events right away in non-batch mode. 
    if (!this.isBatchMode) {
      this.flushEvents();
    }
  }

  private flushEvents() {
    const logEvents : LogEvent[] = [];
    while (this.pendingEvents.length > 0) {
      logEvents.push(this.pendingEvents.shift()!);
    }
    if (logEvents.length === 0) {
      return;
    }
    const clientInfo : FirelogClientInfo = {
      'client_type':this.clientInfo.clientType
    };

    if (this.clientInfo.jsClientInfo) {
      clientInfo['js_client_info'] = {
        'device_type':this.clientInfo.jsClientInfo.deviceType
      };
    }
    if (this.clientInfo.desktopClientInfo) {
      clientInfo['desktop_client_info'] = {
        'device_type':this.clientInfo.desktopClientInfo.os
      };
    }
    const logRequest : LogRequest = {
      client_info:clientInfo,
      log_source_name:LOG_SOURCE,
      request_time_ms:(new Date()).getTime(),
      log_event:logEvents
    };
    this.logRequestTransmitter.sendRequest(logRequest);
  }
}
