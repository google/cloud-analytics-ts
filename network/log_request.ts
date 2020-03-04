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
 *
 * @fileoverview Interface for talking to logging RPC.
 */

import {OsType, DeviceType, ClientType} from '../client_info';

/**
 * Concord Event type
 */
export declare interface ConcordEvent {
  console_type? : string;
  event_type?: string;
  event_name?: string;
  event_metadata?: any[];
  project_number?: string;
  latency_ms?: number;
  browser_window_id?: string;
  hats_response?: HatsResponse;
}

/**
 * Information about the client
 */
export declare interface ClientInfo {
  js_client_info? : JsClientInfo;
  desktop_client_info? : DesktopClientInfo;
  client_type:ClientType;
}

/**
 * The container for a log request
 */
export declare interface LogRequest {
  client_info : ClientInfo;
  log_source_name: string;
  request_time_ms: number;
  log_event: LogEvent[];
}

/**
 * An individual logged event.
 */
export declare interface LogEvent {
  event_time_ms: number;
  source_extension_json: string;
}

/**
 * HaTS Survey response.
 */
export declare interface HatsResponse {
  hats_metadata?: HatsMetadata;
  open_text_response? : OpenTextResponse[];
  multiple_choice_response?: MultipleChoiceResponse[];
  rating_response?: RatingResponse[];
}

/**
 * Client info about the desktop.
 */
export declare interface DesktopClientInfo {
  device_type: OsType;
}

/**
 * Client info about the JS environment.
 */
export declare interface JsClientInfo {
  device_type: DeviceType;
}

/**
 * Metadata for the HaTS survey.
 */
export declare interface HatsMetadata {
  site_id?: string;
  site_name?: string;
  survey_id?: string;
  survey_instance_id?: string;
}

/**
 * Multiple choice responses for the HaTS survey.
 */
export declare interface MultipleChoiceResponse {
  question_number?: number;
  order_index?: number[];
  answer_index?: number[];
  answer_text?: string[];
  order?: number[];
}

/**
 * Question ratings for the HaTS survey.
 */
export declare interface RatingResponse {
  question_number?: number;
  rating?: number;
}

/**
 * Open text responses for the HaTS survey.
 */
export declare interface OpenTextResponse {
  question_number?: number;
  answer_text?: string;
}
