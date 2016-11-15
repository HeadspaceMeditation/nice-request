# Nice Request

nice-request is a promise based library to facilitate service to service communication. It makes use of a singleton pattern and exposes two methods as a part of it's API, setup and request. Additionally, data is logged off of failed responses to enable better metrics for API and system performance.

## Installation

Run this command in a terminal session to add nice-request to your project:

```
npm install nice-request --save
```

## API

* ### setup()

The setup method should be invoked when the express server is initialized with these arguments:

* `logger`: a object with .info() function for logging
* `projectTag`: a string used for constructing the metrics tag (ex. dev.monto-user)

```javascript

const Logger = require('some-logger')
const niceRequest = require('nice-request');

const logger = new Logger();

niceRequest.setup(logger, 'project tag');
```

* ### request()

The request method is to be used to make HTTP requests. It accepts one argument, a configuration object, to set the details for the outbound request.
Successful requests will result in a fulfilled promise with the value of the response.body. Failed requests will result in a rejected promise with a nice error.

```javascript
const niceRequest = require('nice-request');

niceRequest.request({
    url: `http://some-api/users`, // desired resource
    method: 'GET', // desired http method
    metricTag: 'get_account', // string - tag to identify the request in the log (ex. 'create_user')
  })
  .then(result => {});
```

Optional object properties:

  + headers: object - additional http headers specific to the request. most notably in the old code is the x-transaction header and x-gs-session header.
  + body: object - req data
  + queryString: object -
  + timeout: number - override timeout(ms). Default timeout is 25000 ms.
  + resolveWithFullResponse: boolean - true resolve with full response (including headers) instead of just body
  + rejectUnauthorized: boolean - ignore SSL certificate errors (i.e. self-signed certs)
  + maxTries: integer - integer specifying the maximum number of retry attempts.
  + errCond: function - function that accepts an error object for evaluation and returns a boolean indicating if the request should be retried or not


#### Responses

The niceRequest.request(options) function is implemented to return the response body of the request as a JSON object. Please note that headers and http properties are not available in the response body. It is assumed that the http status code is 200 if the requests fulfills.

#### Error Handling

[NiceErrors](https://www.npmjs.com/package/nice-http-error), and [request-promise](https://www.npmjs.com/package/request-promise-json) errors will be returned to the callee with a newly created NiceError.

#### Timeouts

Nice requests will timeout by default after 25 seconds or at the specified time in the requestOptions object if no response is sent back before that timeframe.
