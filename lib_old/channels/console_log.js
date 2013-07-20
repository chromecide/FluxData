;!function(exports, undefined) {
	
	var channel = {
		name: 'console_log',
		publish: function(topic, entity){
			var attr = this.get('attribute');
			if(attr){
				console.log(entity.get(attr));
			}else{
				console.log(entity);	
			}
			
			this.emit('entity', entity);
		},
		params:{
			attribute: {
				name: 'attribute',
				label: 'Attribute',
				type: 'Text'
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