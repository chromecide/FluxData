	if (typeof define !== 'function') {
		var define = require('amdefine')(module);
	}
	
	var __dirname = __dirname?__dirname:'/';
	if(!requirejs){
		if(window && window.requirejs){
			requirejs = window.requirejs;
		}else{
			var requirejs = require('requirejs');
			
			requirejs.config({
				//Use node's special variable __dirname to
				//get the directory containing this file.
				//Useful if building a library that will
				//be used in node but does not require the
				//use of node outside
				baseUrl: __dirname,
			
				//Pass the top-level main.js/index.js require
				//function to requirejs so that node modules
				//are loaded relative to the top-level JS file.
				nodeRequire: require?require:undefined,
				paths: {
					FluxData: './mixins'
				}
			});
		}
	}

	var mixinTypes = {};
	
	function objectConstructor(EventEmitter2, util){
		if(EventEmitter2.EventEmitter2){
			EventEmitter2 = EventEmitter2.EventEmitter2;
		}
		
		function channel(cfg, callback){
			var self = this;
			
			
			self.initialConfig = cfg;
			
			self.mixins = {};
			self._publish = [];
			self._data = {};

			switch(typeof cfg){
				case 'string':
					cfg = {
						type: cfg
					};
					break;
			}
			
			//clone the config object
			var clonedCfg = self.clone.object(cfg);
			/*
			 * Start Mixin Loading
			 */
			var mixins = self.clone.array(clonedCfg.mixins);
			delete clonedCfg.mixins;
			
			for(var key in clonedCfg){
				self.set(key, clonedCfg[key]);
			}
			
			for(var mixIdx=0;mixIdx<mixins.length;mixIdx++){
				var mixinCfg = mixins[mixIdx];
				
				self.mixin(mixinCfg);
			}
			
			if(!self.get('id')){
				self.set('id', generateUUID());
			}
			
			EventEmitter2.call(self, {
				delimiter: '.',
				wildcard: true
			});
			
			self._emit = self.emit;
			
			self.emit = function(topic, data, fn){
				switch(topic){
					case 'newListener':
						self._emit.apply(self, arguments);
						break;
					default:
						var emitData = data;
						if((data instanceof self.constructor)==false){
							emitData = new self.constructor(data);
						}
						self._emit.call(self, topic, emitData);	
						break;
				}
			};
			
			/*
			 * End Mixin Loading
			 */
			//process anything that isn't a mixin
			//self.mixin(cfg);
			
		}
			
			util.inherits(channel, (EventEmitter2&&EventEmitter2.EventEmitter2)?EventEmitter2.EventEmitter2:EventEmitter2);
		
			channel.mixins = mixinTypes;
			
			channel.generateUUID = generateUUID = function(){
				var d = new Date().getTime();
				var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				    var r = (d + Math.random()*16)%16 | 0;
				    d = Math.floor(d/16);
				    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
				});
				return uuid;
			};
			
			channel.registerMixin = function(name, mixin){
				mixinTypes[name] = mixin;
			};
			
			channel.prototype.clone = {
				object: function(obj){
					var retObj = {};
					
					for(var key in obj){
						retObj[key] = obj[key];
					}
					
					return retObj;
				},
				array: function(arr){
					var retArr = [];
					if(arr){
						for(var i=0;i<arr.length;i++){
							retArr.push(arr[i]);
						}	
					}
					
					return retArr;
				}
			};
			
			channel.prototype.get = function(prop){
				var self = this;
				return getDataValueByString(self._data, prop);
			};
			
			channel.prototype.set = function(prop, val){
				var self = this;
				self._data = setDataValueByString(self._data, prop, val);
			};
			
			channel.prototype.init = function(callback){
				if(callback){
					callback(this);
				}
			};
			
			channel.prototype.publish = function(topic, data){
				var self = this;
				var publishers = self._publish;

				for(var i=0;i<publishers.length;i++){
					var fn = publishers[i];
					fn.call(this, topic, data);
				}
			};
			
			channel.prototype.requireMixin = function(mixin, mixinCfg, callback){
				var self = this;
				
				if(!self.mixins[mixin]){
					self.mixin(mixin, mixinCfg, callback);
				}
			};
			
			channel.prototype.mixin = function(mixin, mixinCfg, callback){
				var self = this;
				
				if((typeof mixin)=='string'){
					self.getMixin(mixin, function(mixin){
						if((typeof mixin=='object')){
							for(var key in mixin){
								switch(key){
									case 'init':
										
										break;
									case 'uninit':
									
										break;
									case 'publish':
										self._publish.push(mixin.publish);
										break;
									default:
										self[key] = mixin[key];
										break;
								}
							}
							
							if(mixin.init){
								mixin.init.call(self, mixinCfg, function(err, res){
									if(callback){
										callback(err, res);
									}
								});
							}
						}
					});
				}else{
					if(mixin.type){
						mixinCfg = mixin;
						self.getMixin(mixinCfg.type, function(mixin){
							if((typeof mixin=='object')){
								for(var key in mixin){
									switch(key){
										case 'init':
											
											break;
										case 'uninit':
										
											break;
										case 'publish':
											self._publish.push(mixin.publish);
											break;
										default:
											self[key] = mixin[key];
											break;
									}
								}
								
								if(mixin.init){
									mixin.init.call(self, mixinCfg, function(err, res){
										if(callback){
											callback(err, res);
										}
									});
								}
							}
						});
					}
				}
			};
			
			channel.prototype.getMixin = function(mixinName, callback){
				
				var self = this;
				if(self.mixins[mixinName]){
					return self.mixins[mixinName];	
				}else{
					if((typeof mixinName)=='object'){
						console.log('OBJ supplied');
						callback(mixinName);
					}else{
						requirejs([mixinName], function(mixin){
							self.mixins[mixinName] = mixin;	
							callback(mixin);
						});	
					}
				}
			};
			
			/**
			 * Start Support Functions
			 */
			
			function setDataValueByString(obj, prop, value){
				if(!obj){
					obj = {};
				}
				
				if(prop.indexOf('.')>-1){
					var parts = prop.split('.');
					prop = parts.shift();
					obj[prop] = setDataValueByString(obj[prop], parts.join('.'), value);
				}else{
					obj[prop] = value;
				}
				
				return obj;
			}
			
			function getDataValueByString(obj, prop){
				
				if(prop && prop.indexOf('.')>-1){
					var parts = prop.split('.');
					prop = parts.shift();
					if(obj && obj[prop]){
						return getDataValueByString(obj[prop], parts.join('.'));	
					}else{
						return undefined;
					}
				}else{
					if(obj){
						if(prop){
							return obj[prop];	
						}else{
							return obj;
						}
							
					}else{
						return undefined;
					}
					
				}
			}
		return channel;
	}
		
	define(['eventemitter2', 'util'], function(EventEmitter2, util) {
		return objectConstructor(EventEmitter2, util);
	});