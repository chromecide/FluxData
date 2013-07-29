var FluxData = require('../index');

var replNode = new FluxData.Channel({
	mixins:[
		{
			type: 'mixins/repl/node'
		}
	]
});
