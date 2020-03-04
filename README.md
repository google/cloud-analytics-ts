# Cloud Analytics: Typescript

Cloud Analytics is a library used for logging product usage metrics for 
Cloud products.  Data is stored in the Concord Data Warehouse in a privacy 
compliant manner. 

## How to use the library
Logging a single event can be done by creating an instance of CloudAnalytics 
and passing an event to logEvent.
 
``` typescript
import {CloudAnalytics} from './cloud_analytics';

const cloudAnalytics = new CloudAnalytics(
        'TEST',
        'testApiKey');

const concordEvent = {
    type: 'eventType',
    name: 'eventName',
    projectNumber: '1234567890',
    latency: 123,
    metadata: [
      {key: 'test1', value: 'data1'},
      {key: 'test2', value: 'data2'},
    ],
    userSessionId: '12345',
  };

cloudAnalytics.logEvent(concordEvent);
```

### Batching Events
Batching can be configured by calling enableBatchMode with a desired flush 
interval.  Events will be queued until the specified interval is reached, or
until various browser environment events occur. These include document page 
hide, window beforeUnload & unload.  For Node.JS these include the beforeExit 
SIGHUP events.
 
In the below snippet these two calls to logEvent are batched and sent along
in the same HTTP request.
 
 ``` typescript
 import {CloudAnalytics} from './cloud_analytics';
 
 const cloudAnalytics = new CloudAnalytics(
         'TEST',
         'testApiKey');

 cloudAnalytics.enableBatchMode(1000);
 
 const concordEventOne = {
     type: 'eventType',
     name: 'eventName',
     projectNumber: '1234567890',
     latency: 123,
     metadata: [
       {key: 'test1', value: 'data1'},
       {key: 'test2', value: 'data2'},
     ],
     userSessionId: '12345',
   };

 cloudAnalytics.logEvent(concordEventOne);

 const concordEventOne = {
     type: 'eventType',
     name: 'eventName',
     projectNumber: '1234567890',
     latency: 456,
     metadata: [
       {key: 'test1', value: 'data1'},
       {key: 'test2', value: 'data2'},
     ],
     userSessionId: '12345',
   };
 
 
 cloudAnalytics.logEvent(concordEventOne);
 ```