	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define({
		init: function(){
			var self = this;
			
			process.stdin.resume();
			process.stdin.setEncoding('utf8');
			
			var useLines = self.get('stdio.lines');
			process.stdin.on('data', function(chunk) {
				self.emit('input', chunk);
			});
			
			process.stdin.on('end', function() {
			  process.stdout.write('end');
			});
		}
	});
	