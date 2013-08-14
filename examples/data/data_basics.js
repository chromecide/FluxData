var requirejs = require('requirejs');

process.fdpaths = {
	'mixins': __dirname+'/../../lib'
}

requirejs(['../../index'], function(FluxData){
	
	var userModel = new FluxData.Channel({
		mixins:[
			{
				type: 'FluxData/mixins/data/model',
				fields: [
					{
						name: 'username',
						type: 'string',
						required: true,
						hasmany: false
					},
					{
						name: 'password',
						type: 'password',
						required: true,
						hasmany: false
					},
					{
						name: 'email',
						type: 'email',
						required: true,
						hasmany: false
					}
				]		
			}
		]
	});
	
	userModel.on('model.ready', function(data){
		var user = new FluxData.Channel({
			mixins:[
				{
					type: 'FluxData/mixins/data/record',
					username: 'justin.pradier',
					password: 'test',
					email: 'chromecide@chromecide.com'
				}
			]
		});
	});
	
	/*
	*/
});
