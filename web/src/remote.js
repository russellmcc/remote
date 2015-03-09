"use strict";
//var xhr = require('./xhr');
var Snap = require('snapsvg');
var tinycolor = require('tinycolor2');
var Vec2 = require('vec2');

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

var global_fill = "#FB0036";
var tc_global_fill = tinycolor(global_fill);
var background = "#ABC403";
var tc_background = tinycolor(background);

document.body.style.background = background;

function addBlurIn(s) {
  var f = s.filter(Snap.filter.blur(0,0));
  s.attr({ filter: f });
  var end_func = function() { addBlurOut(s); };
  Snap.animate( 0, 10, function( value ) { f.node.firstChild.attributes[0].value = value + ',' + value;  }, 300, mina.linear, end_func); 
};

function addBlurOut(s) {
  var f = s.filter(Snap.filter.blur(10,10));
  s.attr({ filter: f });
  Snap.animate( 10, 0, function( value ) { f.node.firstChild.attributes[0].value = value + ',' + value;  }, 500 ,mina.easein); 
};


/*function addHueIn(s) {
  var end_func = function() { addHueOut(s); };
  Snap.animate( 0, 86, function( value ) { 
    var hf = s.filter(Snap.filter.hueRotate(value));
    s.attr({ filter: hf }); 
    console.log(value);  }, 300, mina.linear, end_func); 
};


function addHueOut(s) {
  Snap.animate( 86, 86, function( value ) { 
    var hf = s.filter(Snap.filter.hueRotate(value));
    s.attr({ filter: hf }); 
    console.log(value); }, 500 ,mina.easein); 
};*/

function addHueIn(s) {
  var end_func = function() { addHueOut(s); };
  Snap.animate( 0.0, 1.0, function( value ) { 
    tweenColor(s,value,tc_global_fill,tc_background); }, 500, mina.easein, end_func);
};


function addHueOut(s) {
  Snap.animate( 1.0, 0.0, function( value ) { 
    tweenColor(s,value,tc_global_fill,tc_background); }, 500 ,mina.easeout); 
};


function tweenColor(s,at,st,g) {
  var st_hsl = st.toHsl();
  var g_hsl = g.toHsl();
  var st_h_vec = new Vec2(Math.cos(st_hsl.h/360.0*2*Math.PI),Math.sin(st_hsl.h/360.0*2*Math.PI));
  var g_h_vec = new Vec2(Math.cos(g_hsl.h/360.0*2*Math.PI),Math.sin(g_hsl.h/360.0*2*Math.PI));
  st_h_vec.multiply(1.0-at,false);
  g_h_vec.multiply(at,false);
  var vec = st_h_vec.add(g_h_vec,true);
  var ang = Math.atan2(vec.y,vec.x);
  if (ang < 0) ang += 2*Math.PI;
  var calced_h = ang/(2*Math.PI)*360.0;
  var c_hsv = { 
    h:calced_h,
    s:st_hsl.s*(1.0-at)+g_hsl.a*at,
    l:st_hsl.l
  };

  var calced = tinycolor(c_hsv);

  s.selectAll("path").attr({fill: calced.toHexString() });
};


function addSatIn(s) {
  var end_func = function() { addSatOut(s); };
  Snap.animate( 0.0, 1.0, function( value ) { 
    var sf = s.filter(Snap.filter.grayscale(value));
    s.attr({ filter: sf }); }, 300, mina.linear, end_func); 
};


function addSatOut(s) {
  Snap.animate( 1.0, 0.0, function( value ) { 
    var sf = s.filter(Snap.filter.grayscale(value));
    s.attr({ filter: sf }); }, 500 ,mina.easein); 
};


document.addEventListener("DOMContentLoaded", function(event) { 
  console.log("loading and coloring svgs");

  var s = Snap("#svg_holder");

  var s_tv = Snap();
  s.append(s_tv);
  s_tv.attr({width:"50%", height:"16.666%"});
  Snap.load("/icon_svgs/tv.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill, width: "50%"});
    s_tv.append(f);
    s_tv.height = "16.6666%";
    s_tv.width = "50%";
  });

  s_tv.click( function() { addHueIn(s_tv);} );

  var s_upbutt = Snap();
  s_upbutt.attr({width:"25%", height:"16.666%"});
  s.append(s_upbutt);
  Snap.load("/icon_svgs/ch+.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_upbutt.append(f);
  });

  s_upbutt.click( function() { addHueIn(s_upbutt);} );

  var s_downbutt = Snap();
  s_downbutt.attr({width:"25%", height:"16.666%"});
  s.append(s_downbutt);
  Snap.load("/icon_svgs/ch-.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_downbutt.append(f);
  });

  s_downbutt.click( function() { addHueIn(s_downbutt);} );

  var s_power = Snap();
  s_power.attr({width:"25%", height:"16.666%"});
  s.append(s_power);
  Snap.load("/icon_svgs/power.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_power.append(f);
  });

  s_power.click( function() { addHueIn(s_power);} );

  var s_xbox = Snap();
  s_xbox.attr({width:"50%", height:"33.333%"});
  s.append(s_xbox);
  Snap.load("/icon_svgs/xbox.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_xbox.append(f);
  });

  s_xbox.click( function() { addHueIn(s_xbox);} );

  var s_turn = Snap();
  s_turn.attr({width:"50%", height:"33.333%"});
  s.append(s_turn);
  Snap.load("/icon_svgs/turntable.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_turn.append(f);
  });

  s_turn.click( function() { addHueIn(s_turn);} );

  var s_apple = Snap();
  s_apple.attr({width:"50%", height:"33.333%"});
  s.append(s_apple);
  Snap.load("/icon_svgs/appletv.svg", function (f) {
    f.selectAll("path").attr({fill:global_fill});
    s_apple.append(f);
  });

  s_apple.click( function() { addHueIn(s_apple);} );

  var s_volup = Snap();
  s_volup.attr({width:"25%", height:"16.666%"});
  s.append(s_volup);
  Snap.load("/icon_svgs/vol+.svg", function (f) {
    f.select("path").attr({fill:global_fill});
    s_volup.append(f);
  });

  s_volup.click( function() { addHueIn(s_volup);} );

  var s_voldown = Snap();
  s_voldown.attr({width:"25%", height:"16.666%"});
  s.append(s_voldown);
  Snap.load("/icon_svgs/vol-.svg", function (f) {
    f.select("path").attr({fill:global_fill});
    s_voldown.append(f);
  });

  s_voldown.click( function() { addHueIn(s_voldown);} );

  var layout_svgs = function() {
    console.log("laying out svgs");
    var gw = window.innerWidth;
    var gh = window.innerHeight;

    var sz = Math.min(gw/2.0,gh/3.0);

    var y_os = 0.0; // (gh/3.0-sz)*0.5;
    var x_os = 0.0; // (gw/2.0-sz)*0.5;
    console.log(gh);
    console.log(y_os);
    var row_ys = [y_os,gh/3.0+y_os,2.0*gh/3.0+y_os];
    var cols_xs = [x_os,gw/2.0+x_os];
    
    s_tv.attr({x:cols_xs[0], y:row_ys[0]});
    s_upbutt.attr({x:cols_xs[0], y:(row_ys[0]+sz*0.5)});
    s_downbutt.attr({x:(cols_xs[0]+sz*0.5), y:(row_ys[0]+sz*0.5)});

    s_xbox.attr({x:cols_xs[0], y:row_ys[1]});

    s_apple.attr({x:cols_xs[0], y:row_ys[2]});


    s_power.attr({x:(cols_xs[1]+sz*0.5), y:row_ys[0]});

    s_turn.attr({x:cols_xs[1], y:row_ys[1]});

    s_volup.attr({x:(cols_xs[1]+sz*0.5), y:row_ys[2]});
    s_voldown.attr({x:(cols_xs[1]+sz*0.5), y:(row_ys[2]+sz*0.5)});

  };

  window.onresize = function(event) {
    layout_svgs();
  };

  layout_svgs();
});