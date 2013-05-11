;!function(exports, undefined) {
	
	var channel = {
		name: 'Text.prepend',
		params:{
			attribute:{
				name: 'attribute',
				label: 'Attribute',
				type: 'Text'
			},
			value:{
				name: 'value',
				label: 'Value',
				type: 'Text'
			}
		},
		publish: function(entity){
			var attributeName = this.get('attribute');
			
			var value = entity.get(attributeName);
			var newValue = this.get('value')+value;
			entity.set(this.get('attribute'), newValue);
			
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