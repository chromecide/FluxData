if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
	var mixin = {
		//called when first mixing in the functionality
		init: function(cfg){
			var self = this;
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}
		},
		//called when something is published to this channel
		publish: function(topic, data){
		
		}
	}
	
	return mixin;	
});