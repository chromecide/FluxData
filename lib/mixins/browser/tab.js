	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['http://code.jquery.com/jquery-1.9.1.js'], function(){
		var mixin = {
			init: function(){
				var self = this;
				$(document).ready(function(){
					self.emit('document.ready', {
						url: document.location.href
					});
				});
			},
			publish: function(topic, data){
				console.log('----');
				console.log(arguments);
				if(topic=='$'){
					console.log(data);
					var selector = data.selector;
					var method = data.method;
					var args = data.args;
					
					switch(method){
						case 'css':
							$(selector).css(args[0], args[1]);
							break;
						case 'append':
							$(selector).append(args[0]);
							break;
						case 'html':
							$(selector).append();
							break;
						case 'empty':
							$(selector).empty();
							break;
						case 'show':
							$(selector).show();
							break;
						case 'hide':
							$(selector).hide();
							break;
					}
				}
			},
			loadCSS: function(url) {
			    var link = document.createElement("link");
			    link.type = "text/css";
			    link.rel = "stylesheet";
			    link.href = url;
			    document.getElementsByTagName("head")[0].appendChild(link);
			}
		}
		
		return mixin;	
	});
	