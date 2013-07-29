	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define({
		publish: function(topic, data){
			console.log(topic);
			if(data){
				console.log(data.toString());
			}
		}
	});
	