;!function(exports, undefined) {
	
	var channel = {
		name: 'JSON.stringify',
		params:{
			attribute:{
				name: 'attribute',
				label: 'Attribute',
				type: 'Text'
			}
		},
		publish: function(entity){
			var attributeName = this.get('attribute');
			
			var value = entity.get(attributeName);
			var newValue = JSON.stringify(value);
			
			this.emit('entity', this.ensureEntity({
				value:newValue
			}));
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