;!function(exports, undefined) {
	
	var channel = {
		name: 'connect',
		publish: function(entity){
			console.log(entity);
			
			var targetChan = this.targetChannel;
			var sourceChan = entity.get('Channel');
			if(this.output){
				sourceChan.connect(this.output);
			}else{
				sourceChan.connect(this.targetChannel);	
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