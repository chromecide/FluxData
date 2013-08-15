;!function(exports, undefined) {
	var getNowChannel = require(__dirname+'/getNow.js').Channel;
	var formatChannel = require(__dirname+'/format.js').Channel;
	
	var channels = {
		name: 'Date',
		isChannelList: true,
		getNow: getNowChannel,
		format: formatChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);