var FluxData = require('../../../index.js');

var router = new FluxData.Channel({
	id: 'router',
	mixins:[
		{
			type: 'mixins/router/central'
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

router.on('stdin.input', function(data){
	router.publish('stdout.input', data);
});
