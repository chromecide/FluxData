/*
 * This Node will handle the input from it's stdio and pass it onto to any other channels it has registered
 */

var FluxData = require('../../../index.js');

var router = new FluxData.Channel({
	id: 'ServerNode',
	mixins:[
		{
			type: 'mixins/router/auto'
		},
		{
			type: 'mixins/tcp/jsonConnector',
			TCPConnector: {
				port: 9000
			}
		}
	]
});

var localNode = new FluxData.Channel({
	id: 'JSONServerNode',
});

//add a publisher to pass through any events from localNode to the router
localNode._publish.push(function(topic, data){
	var self = this;
	self.emit(topic, data);
});

router.publish('router.channel', localNode);

setTimeout(function(){
	console.log('publishing to local node');
	localNode.publish('myEvent', {test: 'blahblah'});
}, 5000);

