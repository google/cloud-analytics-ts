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
 * @fileoverview Types of survey response that can be sent to Cloud.
 */

/**
 * Event type. Object to describe a survey response.
 */
export declare interface SurveyResponse {
  projectNumber?: string;
  userSessionId?: string;
  metadata?: SurveyMetadata;
  multipleChoiceResponses?: MultipleChoiceResponse[];
  ratingResponses?: RatingResponse[];
  openTextResponses?: OpenTextResponse[];
}

/**
 * Metadata about a Survey.
 */
export declare interface SurveyMetadata {
  siteId?: string;
  siteName?: string;
  surveyId?: string;
  surveyInstanceId?: string;
}

/**
 * Metadata about a Survey.
 */
export declare interface SurveyMetadata {
  siteId?: string;
  siteName?: string;
  surveyId?: string;
  surveyInstanceId?: string;
}

/**
 * Multiple Choice Response of a Survey.
 */
export declare interface MultipleChoiceResponse {
  questionNumber?: number;
  orderIndex?: number[];
  answerIndex?: number[];
  answerText?: string[];
  order?: number[];
}

/**
 * Rating Response of a Survey.
 */
export declare interface RatingResponse {
  questionNumber?: number;
  rating?: number;
}

/**
 * Open-Text Response of a Survey.
 */
export declare interface OpenTextResponse {
  questionNumber?: number;
  answerText?: string;
}
