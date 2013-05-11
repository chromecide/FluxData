;!function(exports, undefined) {
	
	var channel = {
		name: 'connect',
		params:{
			targetChannel: {
				name: 'targetChannel',
				label: 'Target Channel',
				type: 'channel'
			},
			output: {
				name:'output',
				label: 'Output',
				type: 'Text'
			}
		},
		publish: function(entity){
			
			/*var targetChan = this.get('targetChannel');
			var sourceChan = entity;//.get('Channel');
			
			if(this.output){
				sourceChan.connect(this.output, this.targetChannel);
			}else{
				sourceChan.connect(this.targetChannel);	
			}*/
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