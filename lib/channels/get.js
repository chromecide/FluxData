;!function(exports, undefined) {
	
	var channel = {
		name: 'get',
		publish: function(entity){
			var value = entity.get(this.attribute);
			
			this.emit('entity', value);
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