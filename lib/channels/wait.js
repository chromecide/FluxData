;!function(exports, undefined) {
	
	var channel = {
		name: 'wait',
		label: 'Wait',
		params:{
			interval: {
				name: 'interval',
				label: 'Interval',
				description: 'Interval In Seconds',
				type: 'Number'
			}
		},
		publish: function(topic, entity){
			var interval = this.get('interval');
			if(!interval){
				interval = 1;
			}
			console.log(interval);
			var self = this;
			console.log('setting timeout');
			setTimeout(function(ent){
				return function(){
					console.log('EMITTING');
					self.emit('entity', ent);
				}
			}(entity), interval*1000);
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