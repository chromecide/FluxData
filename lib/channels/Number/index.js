;!function(exports, undefined) {
	var addChannel = require(__dirname+'/add.js').Channel;
	var subtractChannel = require(__dirname+'/subtract.js').Channel;
	
	var channels = {
		name: 'Number',
		isChannelList: true,
		add: addChannel,
		subtract: subtractChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);