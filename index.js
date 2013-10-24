if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

/**
 * The core FluxData Object
 * @module FluxData
 * @uses  Channel 
 */

define(['./lib/channel.js'], function(Channel) {
	return {
		Channel: Channel
	};
});