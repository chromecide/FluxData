	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['http://d3lp1msu2r81bx.cloudfront.net/kjs/js/lib/kinetic-v4.5.4.min.js'], function(K){
		var mixin = {
			init: function(){
				var self = this;
				console.log(Kinetic);
			}
		}
		
		return mixin;	
	});
	