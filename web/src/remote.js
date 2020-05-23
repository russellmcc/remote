"use strict";
var xhr = require('./xhr');

var server_address = 'http://192.168.1.171:8888';

var handleAction = function() {
	console.log(this.id);
	this.style.webkitAnimationName = 'click';
	// tell the raspberry pi about it
	xhr({
		verb: 'PUT',
		url: server_address+'/state',
		data: {
			mode: this.id
		},
		urlencoded: true
	});

}

// associate on clicks and make sure we clear the animation name
var elems = document.getElementsByClassName('button');

[].forEach.call(elems, function (el) {
	el.addEventListener('webkitAnimationEnd', function(){
    	this.style.webkitAnimationName = '';
	}, false);
	el.addEventListener('click',handleAction);
});

