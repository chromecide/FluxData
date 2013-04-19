;!function(exports, undefined) {
	
	var channel = {
		name: 'console_log',
		publish: function(entity){
			console.log('-----------');
			console.log(entity);
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