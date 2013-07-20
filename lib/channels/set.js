;!function(exports, undefined) {
	
	var channel = {
		name: 'set',
		publish: function(topic, entity){
			var returnEntity = entity.get('entity');
			var attributeName = entity.get('attribute');
			
			var value = entity.get('value');
			
			returnEntity.set(attributeName, value);
			
			this.emit('entity', returnEntity);
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