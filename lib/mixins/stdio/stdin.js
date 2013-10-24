if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
/**
 * ### STDIO mixin
 * @class FluxData.stdio.stdin
 * @extensionfor Channel
 */
define(function(){
	var mixin = {
		//called when first mixing in the functionality
		init: function(cfg, callback){
			var self = this;
			var errs = false;
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}

			process.stdin.resume();
			process.stdin.setEncoding(self.get('encoding') || 'utf8');
			
			process.stdin.on('data', function(data) {
				self.emit('data', {
					data: data
				});
			});
			
			process.stdin.on('end', function() {
				process.stdout.write('end');
				self.emit('end', {});
			});

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