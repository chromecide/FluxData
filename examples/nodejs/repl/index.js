var FluxData = require('../../../index.js');

var repl = new FluxData.Channel({
	id: 'repl',
	mixins:[
		{
			type: 'mixins/repl/node'
		},
		{
			type: 'mxins/router/auto'
		},
		{
			type: 'mixins/tcp/connector',
			TCPConnector: {
				port:9000
			}
		}
	]
});
