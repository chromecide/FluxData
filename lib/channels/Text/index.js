;!function(exports, undefined) {
	var prependChannel = require(__dirname+'/prepend.js').Channel;
	var appendChannel = require(__dirname+'/append.js').Channel;
	
	var channels = {
		name: 'Text',
		isChannelList: true,
		prepend: prependChannel,
		append: appendChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);