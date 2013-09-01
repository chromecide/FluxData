var FluxData = require('../../');

var exampleStore = new FluxData.Channel({
	mixins: [
		{
			type: 'FluxData/data/Store'
		}
	]
});

var userCollection = new FluxData.Channel({
	mixins: [
		{
			type: 'FluxData/data/collection'
		}
	],
	id: 'users',
	name: 'users'
});

exampleStore.onAny(function(){
	var self = this;
	console.log(this.event);
});

exampleStore.on('mixin.ready', function(){
	console.log('saving collection');
	exampleStore.publish('collection.save', userCollection);
});


// 


// var userCollection = new FluxData.Channel({
// 	mixins:[
// 		{
// 			type: 'FluxData/data/collection'
// 		}
// 	]
// });

// userCollection.on('collection.ready', function(data){
// 	console.log('collection ready');
// });

	// var userModel = new FluxData.Channel({
	// 	mixins:[
	// 		{
	// 			type: 'FluxData/mixins/data/model',
	// 			fields: [
	// 				{
	// 					name: 'username',
	// 					type: 'string',
	// 					required: true,
	// 					hasmany: false
	// 				},
	// 				{
	// 					name: 'password',
	// 					type: 'password',
	// 					required: true,
	// 					hasmany: false
	// 				},
	// 				{
	// 					name: 'email',
	// 					type: 'email',
	// 					required: true,
	// 					hasmany: false
	// 				}
	// 			]
	// 		}
	// 	]
	// });
	
	// userModel.on('model.ready', function(data){
	// 	var user = new FluxData.Channel({
	// 		mixins:[
	// 			{
	// 				type: 'FluxData/mixins/data/record',
	// 				username: 'justin.pradier',
	// 				password: 'test',
	// 				email: 'chromecide@chromecide.com'
	// 			}
	// 		]
	// 	});
	// });