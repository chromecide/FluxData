;!function(exports, undefined) {
	
	var channel = {
		name: 'http.get',
		label: 'GET',
		params:{
			url:{
				name:'url',
				label: 'URL',
				type: 'Text'
			}
		},
		outputs: [
			{
				name: 'geterror',
				label: 'Get Error'
			}
		],
		publish: function(topic, entity){
			var self = this;
			
			var url = entity.get('url');
			if(!url){
				url = self.get('url');
			}
			
			if(!url){
				self.emit('geterror', {value: 'No URL supplied'});
			}else{
				var request = require('request');
				
				request(url, function(err, resp, body) {
					if(err){
						self.emit('geterror', {value: err});
					}else{
						self.emit('entity', self.ensureEntity({
				  			value: body
				  		}));
					}
				});	
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