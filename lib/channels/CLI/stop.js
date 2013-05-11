;!function(exports, undefined) {
	
	var channel = {
		name: 'CLI.Stop',
		publish: function(entity){
			var app = entity.get('script');
			var signal = this.get('signal');
			app.kill(signal);
			this.emit('entity', entity);
		},
		params:{
			signal: {
				name: 'signal',
				label: 'Signal',
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