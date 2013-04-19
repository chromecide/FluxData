;!function(exports, undefined) {
	var channelCtr = require(__dirname+'/../channel');
	channel = {
		name: 'chain',
		publish: function(entity){
			var thisChain = this;
			var firstLink = new channelCtr.Channel(thisChain.name+'_0', this.channels[0]);
			var currentLink = firstLink;
			
			for(var i=1;i<this.channels.length;i++){
				var nextLink = new channelCtr.Channel(thisChain.name+'_'+i, this.channels[i]);
				currentLink = currentLink.connectTo(nextLink);
			}
			
			i++;
			
			nextLink = new channelCtr.Channel(thisChain.name+'_'+i, {
				type: 'udf',
				fn: function(entity){
					thisChain.emit('entity', entity);
				}
			});
			
			currentLink.connect(nextLink);
			
			firstLink.publish(entity);
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