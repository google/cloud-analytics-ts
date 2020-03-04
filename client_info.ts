/**
 * @fileoverview Types of event hits that can be sent to Cloud.
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

/**
 * Information about the client type.
 */
export enum ClientType {

  JS = 'JS',

  DESKTOP = 'DESKTOP'
}

/**
 * Information about a device client.
 */
export declare interface ClientInfo {
  clientType: ClientType;

  jsClientInfo?: JsClientInfo;

  desktopClientInfo?: DesktopClientInfo;
}

/**
 * The type of Operating System.
 */
export enum OsType {

  MAC = 'mac',

  WINDOWS = 'windows',

  LINUX = 'linux'
}

/**
 * Information about a Desktop client.
 */
export declare interface DesktopClientInfo {
  os: OsType;
}

/**
 * Information about a Device type.
 */
export enum DeviceType {
  UNKNOWN = 'UNKNOWN',

  MOBILE = 'MOBILE',

  DESKTOP = 'DESKTOP',

  TABLET = 'TABLET',

  GOOGLE_HOME = 'GOOGLE_HOME'
}

/**
 * Information about a JavaScript client.
 */
export declare interface JsClientInfo {
  deviceType: DeviceType;
}
