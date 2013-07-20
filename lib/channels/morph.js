;!function(exports, undefined) {
	
	var channel = {
		name: 'morph',
		params:{
			map: {
				name: 'map',
				label: 'Attribute Map',
				type: 'object'
			},
			targetModel: {
				name: 'targetModel',
				label: 'Target Model',
				type: 'model'
			}
		},
		publish: function(topic, entity){
			entity = this.ensureEntity(entity);
			
			var newEntity = new this._Entity(this.targetModel);
			
			for(var targetAttr in this.map){
				var keyValue = this.map[targetAttr];
				if((typeof keyValue)=='string'){
					if(keyValue.indexOf('entity.')==0){//not looking for an attribute of the source object
						
						var attrName = keyValue.replace('entity.', '');
						
						keyValue = entity.get(attrName);
					}	
				}

				newEntity.set(targetAttr, keyValue);
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