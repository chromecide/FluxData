if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['repl'], function(repl){
	return {
		init: function(callback){
			var self = this;
			self.REPL = repl.start({
				prompt: self.get('prompt') || ">",
				input: process.stdin,
				output: process.stdout
			});
			self.REPL.context.thisChannel = self;
		}
	}
});
