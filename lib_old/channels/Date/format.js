;!function(exports, undefined) {
	var dateFormat = require('dateformat');
	var channel = {
		name: 'Date.format',
		label: 'Format',
		params:{
			format: {
				name: 'format',
				label: 'Format',
				type: 'Text'
			}
		},
		publish: function(topic, entity){
			var dateValue = entity.get('value');
			
			var dateString = dateFormat(dateValue, this.get('format'));
			
			this.emit('entity', this.ensureEntity({value: dateString}));
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