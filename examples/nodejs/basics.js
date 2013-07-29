var FluxData = require('../../index.js');

var router = new FluxData.Channel({
	id: 'router',
	mixins:[
		{
			type: 'mixins/router/auto'
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

var stdoutChannel = new FluxData.Channel({
	id: 'stdout',
	name: 'stdout',
	mixins: [
		{
			type: 'mixins/stdio/stdout'
		}
	]
});

router.publish('router.channel', stdinChannel);
router.publish('router.channel', stdoutChannel);

/*router.publish('route', {
	source: 'stdin',
	sourceTopic: 'input',
	target: 'stdout',
	targetTopic: 'input'
});*/

/*
stdinChannel.on('input', function(data){
	stdOutChannel.publish('input', data);
});*/
