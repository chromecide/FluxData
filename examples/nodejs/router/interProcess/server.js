/*
 * This Node will handle the input from it's stdio and pass it onto to any other channels it has registered
 */

var FluxData = require('../../../../index.js');

var router = new FluxData.Channel({
	id: 'ServerNode',
	mixins:[
		{
			type: 'mixins/router/auto'
		},
		{
			type: 'mixins/tcp/connector',
			TCPConnector:{
				port: 9000
			}
		}
	]
});

var stdinChannel = new FluxData.Channel({
	id: 'stdin',
	name: 'test node',
	mixins:[
		{
			type: 'mixins/stdio/stdin'
		}
	]
});

router.publish('router.channel', stdinChannel);

