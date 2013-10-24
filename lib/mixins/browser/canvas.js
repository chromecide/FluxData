if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['http://d3lp1msu2r81bx.cloudfront.net/kjs/js/lib/kinetic-v4.5.4.min.js'], function(){
	var mixin = {
		//called when first mixing in the functionality
		init: function(cfg, callback){
			var self = this;
			var errs = false;
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}

			if(callback){
				callback(errs, self);
			}
		},
		//called when something is published to this channel
		publish: function(topic, data){
			
		}
	};
	
	return mixin;
});