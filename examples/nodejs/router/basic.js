var FluxData = require('../../../index.js');

//create the main router channel
var router = new FluxData.Channel({
	id: 'router',
	mixins:[
		{
			type: 'mixins/router/index'
		}
	]
});


//create a stdin channel
var stdinChannel = new FluxData.Channel({
	id: 'stdin',
	name: 'test node',
	mixins:[
		{
			type: 'mixins/stdio/stdin'
		}
	]
});


//create a stdout channel
var stdoutChannel = new FluxData.Channel({
	id: 'stdout',
	name: 'stdout',
	mixins: [
		{
			type: 'mixins/stdio/stdout'
		}
	]
});

//publish the stdio channels to the router
router.publish('router.channel', stdinChannel);
router.publish('router.channel', stdoutChannel);

//publish a new router to the router
router.publish('route', {
	source: 'stdin',
	sourceTopic: 'input',
	target: 'stdout',
	targetTopic: 'input'
});
