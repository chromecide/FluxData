;!function(exports, undefined) {
	
	var channel = {
		name: 'FluxData.RemoteNodeTCP',
		label: 'Remote Node (TCP)',
		publish: function(topic, entity){
			
			var returnObj = this.ensureEntity({
				channels: this.getChannels()
			});
			
			this.emit('entity', returnObj);
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