;!function(exports, undefined) {
	var loadChannelsChannel = require(__dirname+'/loadChannels.js').Channel;
	var triggerChannel = require(__dirname+'/trigger.js').Channel;
	
	var channels = {
		name: 'FluxData',
		isChannelList: true,
		loadChannels: loadChannelsChannel,
		trigger: triggerChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);