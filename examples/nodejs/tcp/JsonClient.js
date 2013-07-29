/*
 * This Node will handle the input from it's stdio and pass it onto to any other channels it has registered
 */

var FluxData = require('../../../index.js');

var serverNode = new FluxData.Channel({
	mixins: [
		{
			type: 'mixins/tcp/jsonSocket',
			TCPSocket: {
				port: 9000
			}
		}
	]
});

serverNode.onAny(function(data){
	console.log(this.event);
});
