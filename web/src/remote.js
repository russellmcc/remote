"use strict";
//var xhr = require('./xhr');
var Snap = require('snapsvg');

window.addEventListener('load', function(){

  /*var element = window.document.getElementById('clickhere');
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
  });*/
});

var global_fill = "#C1EE09";
document.addEventListener("DOMContentLoaded", function(event) { 
  console.log("loading and coloring svgs");

  var s_tv = Snap("#tvbutton");
  s_tv.height = "100%";
  s_tv.width = "100%";
  Snap.load("/icon_svgs/tv.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill, width: "50%"});
    s_tv.append(f);
  });

  var s_upbutt = Snap("#chupbutton");
  s_upbutt.height = "100%";
  s_upbutt.width = "100%";
  Snap.load("/icon_svgs/ch+.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_upbutt.append(f);
  });

  var s_downbutt = Snap("#chdownbutton");
  s_downbutt.height = "100%";
  s_downbutt.width = "100%";
  Snap.load("/icon_svgs/ch-.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_downbutt.append(f);
  });

  var s_power = Snap("#powerbutton");
  Snap.load("/icon_svgs/power.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_power.append(f);
  });

  var s_xbox = Snap("#xboxbutton");
  Snap.load("/icon_svgs/xbox.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_xbox.append(f);
  });

  var s_turn = Snap("#turntablebutton");
  Snap.load("/icon_svgs/turntable.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_turn.append(f);
  });

  var s_apple = Snap("#appletvbutton");
  Snap.load("/icon_svgs/appletv.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_apple.append(f);
  });

  var s_volup = Snap("#volupbutton");
  Snap.load("/icon_svgs/vol+.svg", function (f) {
    f.select("path").attr({fill:global_fill});
    s_volup.append(f);
  });

  var s_voldown = Snap("#voldownbutton");
  Snap.load("/icon_svgs/vol-.svg", function (f) {
    f.select("path").attr({fill:global_fill});
    s_voldown.append(f);
  });


});