;!function(exports, undefined) {
	
	var channel = {
		name: 'Date.getNow',
		label: 'Get Now',
		publish: function(topic, entity){
			var now = new Date();
			
			this.emit('entity', this.ensureEntity({value: now}));
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