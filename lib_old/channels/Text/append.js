;!function(exports, undefined) {
	
	var channel = {
		name: 'Text.append',
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
		inputs: [
			{
				name: 'setvalue',
				label: 'Set Value'
			}
		],
		publish: function(topic, entity){
			if(topic=='setvalue'){
				this.set('value', entity.get('value'));
			}else{
				var value = entity.get(attributeName);
				
				var newValue = value+this.get('value');
				entity.set(attributeName, newValue);
				
				this.emit('entity', entity);	
			}
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