"use strict";
var xhr = require('./xhr');

window.addEventListener('load', function(){
  var element = window.document.getElementById('clickhere');
  element.addEventListener('mousedown', function(){
    xhr({url: 'http://10.0.1.12/api/newdeveloper/lights/3'})
      .then(JSON.parse.bind(JSON))
      .then(function(resp){
        xhr({
          verb: 'PUT',
          url: 'http://10.0.1.12/api/newdeveloper/lights/3/state',
          data: JSON.stringify({
            on: !resp.state.on
          })
        });
      });
  });
});
