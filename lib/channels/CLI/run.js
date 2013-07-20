;!function(exports, undefined) {
	
	var channel = {
		name: 'CLI.Run',
		publish: function(topic, entity){
			var spawn = require('child_process').spawn;
			var scriptName = entity.get('scriptName');
			if(!scriptName){
				scriptName = this.get('scriptName');
			}
			
			var args = entity.get('args');
			if(!args){
				args = this.get('args');
			}
			
			var spawnOptions = {};
			spawnOptions = entity.get('options');
			if(!spawnOptions){
				spawnOptions = this.get('options');
			}
			
			var cwd = entity.get('cwd');
			if(!cwd){
				cwd = this.get('cwd');
			}
			if(cwd){
				spawnOptions.cwd = cwd;
			}
			
			var childApp = spawn(scriptName, args, spawnOptions);
			
			var returnObj = {
				script: childApp,
				args: args,
				options: spawnOptions
			}
			
			this.emit('entity', ensureEntity(returnObj));
		},
		params:{
			cwd: {
				name: 'cwd',
				label: 'Working Directory',
				type: 'Text'
			},
			scriptName: {
				name: 'scriptName',
				label: 'Script Name',
				type: 'Text'
			},
			options:{
				name: 'options',
				label: 'Options',
				type: 'object'
			},
			args:{
				name: 'args',
				label: 'Args',
				type: 'Text',
				hasMany: true
			}
		}
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);