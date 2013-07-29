var mixin = {
	REPL: {
		start:{
			stdio: function(){
				var self = this;
				repl.start({
				  prompt: self.get('prompt') || ">",
				  input: process.stdin,
				  output: process.stdout
				});		
			}
		}
	},
	startRepl: function(){
		
	},
	init: function(callback){
		var self = this;
		var replType = self.get('replType') || 'stdio';
		
		self.REPL.start.stdio.call(self);
	},
	uninit: function(){
		
	}
}

	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define({
		init: function(){
			var self = this;
			
		}
	});
	