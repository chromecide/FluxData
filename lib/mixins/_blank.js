if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
	var mixin = {
		init: function(cfg){
			var self = this;
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}
		}
	}
	
	return mixin;	
});
