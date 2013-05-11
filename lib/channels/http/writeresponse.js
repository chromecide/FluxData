;!function(exports, undefined) {
	
	var channel = {
		name: 'http.writeresponse',
		label: 'Write Response',
		publish: function(entity){
			console.log(entity);
			//console.log(entity.get('request.url'));
			var response = entity.get('response');
			var content = entity.get('value');
			
			response.write(content);
			response.end();
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