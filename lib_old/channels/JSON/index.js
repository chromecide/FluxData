;!function(exports, undefined) {
	var stringifyChannel = require(__dirname+'/stringify.js').Channel;
	
	var channels = {
		name: 'JSON',
		isChannelList: true,
		stringify: stringifyChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);