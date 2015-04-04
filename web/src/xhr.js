"use strict";
var _ = require('../bower_components/lodash/lodash');

module.exports = function(options) {
  options = _.defaults(options, {
    verb: 'GET'
  });

  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open(options.verb, options.url, true);
    if (options.username && options.password) {
      req.setRequestHeader("Authorization", "Basic " + btoa(options.username + ":" + options.password));
    }

    req.onload = function() {
      var isSuccess = function (status) {
        return status >= 200 && status < 300;
      };
      if (isSuccess(req.status)) {
        resolve(req.response);
      }
      else {
        var err = new Error(req.statusText);
        err.response = req.response;
        reject(err);
      }
    };

    req.onerror = function() {
      reject(new Error("Protocol Error"));
    };

    if (options.data && typeof options.data === 'object') {
      if (options.urlencoded) {
        // If the user requested, use url encoding
        var dataStrings = [];
        for (var key in options.data) {
          var value = options.data[key];
          dataStrings.push(window.encodeURIComponent(key) +
                           "=" +
                           window.encodeURIComponent(value));
        }
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(dataStrings.join('&'));
      } else {
        // By default, use multipart
        var data;
        data = new FormData();
        for (var key in options.data) {
          data.append(key, options.data[key]);
        }
        req.send(data);
      }
    } else if (typeof options.data === 'string') {
      req.send(options.data);
    } else {
      req.send();
    }
  });
};
