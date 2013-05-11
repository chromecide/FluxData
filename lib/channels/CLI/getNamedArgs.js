;!function(exports, undefined) {
	
	var channel = {
		name: 'CLI.GetArgs',
		label: 'Get Args',
		publish: function(entity){
			var args = process.argv;
			var retObj = {
				scriptName: args[1]
			}
			
			for(var i=2;i<args.length;i++){
				var arg = args[i];
				var argParts = arg.split('=');
				retObj[argParts[0]] = argParts[1];
			}
			
			this.emit('entity', this.ensureEntity(retObj));
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