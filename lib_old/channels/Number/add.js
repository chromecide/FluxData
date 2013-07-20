;!function(exports, undefined) {
	
	var channel = {
		name: 'Number.Add',
		label: 'Add (+)',
		params:{
			attribute:{
				name: 'attribute',
				label: 'Attribute',
				type: 'Text'
			},
			value:{
				name: 'value',
				label: 'Value',
				type: 'Number'
			}
		},
		publish: function(topic, entity){
			var attributeName = this.get('attribute');
			
			var value = entity.get(attributeName);
			var newValue = value+this.get('value');
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