	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	/**
	 * ## Static HTTP Server Mixin
	 *
	 * Server Static Files over HTTP
	 *
	 * **Example**
	 *```
	 * var FluxData = require('FluxData');
	 *
	 * var httpServer = new FluxData.Channel({
	 *   mixins:[
	 *     {
	 *       type: 'FluxData/http/static_server',
	 *       port: 8080,
	 *       webroot: process.cwd()
	 *     }
	 *   ]
	 * });
	 * ```
	 * @class FluxData.http.static_server
	 * @extensionfor Channel
	 * @extends FluxData.http.server
	 * @requires fs url path;
	 */
	
	/**
	 * @attribute paths
	 */
	
	/**
	 * @attribute webroot
	 */
	define(['fs', 'url', 'path'], function(fs, url, path){
		var mixin = {
			
			init: function(cfg){
				var self = this;
				
				self.set('paths', {});

				if(cfg){
					for(var key in cfg){
						if(key=='paths'){
							for(var pathKey in cfg.paths){
								self.set('paths.'+pathKey, cfg.paths[pathKey]);
							}
						}else{
							self.set(key, cfg[key]);
						}
					}
				}

				self.mixin('mixins/http/server', cfg, function(){
					
					self.on('http.request', function(data){
						var request = data.get('request');
						var response = data.get('response');
						var basePath = self.get('webroot') || process.cwd();
						
						var uri = url.parse(request.url).pathname;
						
						var filename;
						switch(uri){
							case '/eventemitter2.js':
								filename=path.join(self.get('paths.FluxData'),'/node_modules/eventemitter2/lib/eventemitter2.js');
								break;
							case '/util.js':
								filename=path.join(self.get('paths.FluxData'),'/lib/browser_util.js');
								break;
							case '/require.js':
								filename=path.join(self.get('paths.FluxData'),'/node_modules/requirejs/require.js');
								break;
							default:
								if (uri.match(/\/$/)) uri = uri + 'index.html';
								filename = path.join(basePath, uri);
								break;
						}
						console.log(filename);
						fs.exists(filename, function(exists){
							if (!exists){
								//TODO: Check Against the paths attribute
								var paths = self.get('paths');
								var pathURL = false;
								
								for(var key in paths){
									//turn the key into a regex object
									var testURL = uri;
									if(testURL.indexOf('/')==0){
										testURL = testURL.substring(1, testURL.length);
									}
									var pattern = new RegExp(key.replace('/','\/')+'(.*)');
									
									if(pattern.test(uri)){
										pathURL = paths[key]+uri.replace(key, '');
										
									}
								}
								
								if(pathURL){
									var pfilename = path.resolve(pathURL);
									
									fs.exists(pfilename, function(exists){
										
										if(!exists){
											response.writeHead(404, {
												"Content-Type": "text/plain"
											});
											//response.write("404 Not Found\n");
											response.end();
											return;
										}
										
										fs.readFile(pfilename, "binary", function(err, file){
											if (err){
												response.writeHead(500, {
													"Content-Type": "text/plain"
												});
												//response.write("500 Not Found\n");
												response.end();
												return;
											}
											response.writeHead(200);
											response.write(file, "binary");
											response.end();
										});
									});
								}else{
									response.writeHead(404, {
										"Content-Type": "text/plain"
									});
									//response.write("404 Not Found\n");
									response.end();
								}
								
								return;	
							}else{
								fs.readFile(filename, "binary", function(err, file){
									if (err){
										response.writeHead(500, {
											"Content-Type": "text/plain"
										});
										//response.write("500 Not Found\n");
										response.end();
										return;
									}
									/**
									 * @event http.request.done
									 * @param {Object} Channel `data`
									 */
									self.emit('http.request.done', data);
									response.writeHead(200);
									response.write(file, "binary");
									response.end();
								});	
							}
						});
					});
				});
			}
		}
		return mixin;
	});
	