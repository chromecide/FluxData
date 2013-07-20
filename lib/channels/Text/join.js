;!function(exports, undefined) {
	
	var channel = {
		name: 'Text.join',
		meshGlobal: true,
		params:{
			value1:{
				name: 'value1',
				label: 'Value 1',
				type: 'Text'
			},
			value2:{
				name: 'value2',
				label: 'Value 2',
				type: 'Text'
			},
			seperator: {
				name: 'seperator',
				label: 'Seperator'
			}
		},
		inputs:[
			{
				name: 'value1',
				label: 'Value 1',
				type: 'Text'
			},
			{
				name: 'value2',
				label: 'Value 2',
				type: 'Text'
			}
		],
		publish: function(topic, entity){
			
			switch(topic){
				case 'value1':
					this.set('value1', entity.get('value'));
					if(this.get('value2')){
						this.emit('entity', this.get('value1')+this.get('seperator')+this.get('value2'));
					}
					break;
				case 'value2':
					this.set('value2', entity.get('value'));
					if(this.get('value1')){
						this.emit('entity', this.get('value1')+this.get('seperator')+this.get('value2'));
					}
					break;
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