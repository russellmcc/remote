"use strict";
var _ = require('../bower_components/lodash/lodash');

module.exports = function(options) {
  options = _.defaults(options, {
    verb: 'GET'
  });

  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open(options.verb, options.url);

    req.onload = function() {
      var isSuccess = function (status) {
        return status >= 200 && status < 300;
      };
      if (isSuccess(req.status)) {
        resolve(req.response);
      }
      else {
        reject(new Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(new Error("Protocol Error"));
    };

    if (options.data && typeof options.data === 'object') {
      var data;
      data = new FormData();
      for (var key in options.data) {
        data.append(key, options.data[key]);
      }
      req.send(data);
    } else if (typeof options.data === 'string') {
      req.send(options.data);
    } else {
      req.send();
    }
  });
};