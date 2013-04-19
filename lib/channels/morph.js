;!function(exports, undefined) {
	
	var channel = {
		name: 'morph',
		publish: function(entity){
			entity = this.ensureEntity(entity);
			
			var newEntity = new this._Entity(this.targetModel);
			
			for(var key in this.map){
				var keyValue = entity.get(key);
				newEntity.set(this.map[key], keyValue);
			}
			
			this.emit('entity', newEntity);
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