;!function(exports, undefined) {
	
	var channel = {
		name: 'http.do404',
		label: 'Send 404 - Page Not Found',
		publish: function(topic, entity){
			
			var response = entity.get('response');
			response.writeHead(404);
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