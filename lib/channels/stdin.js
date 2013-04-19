;!function(exports, undefined) {
	
	var channel = {
		name: 'stdin',
		init: function(callback){
			var self = this;
			process.stdin.on('data', function(data){
				var out = new self._Entity({
					Text: data.toString().replace('\n','')
				});
				self.emit('entity', out);
			});
			
			process.stdin.resume();
			
			if(callback){
				callback();
			}
		},
		publish: function(entity){
			this.emit('entity', entity);
		}
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);