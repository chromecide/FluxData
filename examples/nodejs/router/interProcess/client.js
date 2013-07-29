/*
 * This Node will handle the input from it's stdio and pass it onto to any other channels it has registered
 */

var FluxData = require('../../../../index.js');

var router = new FluxData.Channel({
	id: 'ClientNode',
	mixins:[
		{
			type: 'mixins/router/auto'
		}
	]
});

var stdoutChannel = new FluxData.Channel({
	id: 'stdin',
	name: 'test node',
	mixins:[
		{
			type: 'mixins/stdio/stdout'
		}
	]
});

var socketChannel = new FluxData.Channel({
	id: 'node1',
	mixins:[
		{
			type: 'mixins/tcp/socket',
			TCPSocket:{
				port: 9000
			}
		}
	]
});

		
router.publish('router.channel', stdoutChannel);
router.publish('router.channel', socketChannel);

