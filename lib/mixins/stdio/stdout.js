	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define({
		init: function(cfg, callback){
			console.log('init');
			var self = this;

			var errs = [];
			
			
			
			if(callback){
				if(errs.length===0){
					errs = false;
				}
			
				callback(cfg);
			}
		},
		publish: function(topic, data){
			switch(topic){
				case 'write':
					process.stdout.write(data.data);
					break;
			}
		}
	});
	