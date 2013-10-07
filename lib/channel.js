	if (typeof define !== 'function') {
		var define = require('amdefine')(module);
	}
	
	var __dirname = __dirname?__dirname:'/';
	if(!requirejs){
		if((typeof window)!=='undefined'){
			if(window.requirejs){
				requirejs = window.requirejs;
			}
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

			
			EventEmitter2.call(self, {
				delimiter: '.',
				wildcard: true
			});

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
			
			/*if(mixins.length===0 && clonedCfg.type){
				mixins = [{type: clonedCfg.type}];
			}*/
			
			delete clonedCfg.mixins;
			
			for(var key in clonedCfg){
				self.set(key, clonedCfg[key]);
			}
			
			var mixinCount = mixins.length;
			var mixedCount = 0;

			var isReady = false;

			
			
			self.once('mixins.ready', function(){
				if(callback){
					callback.call(self, {ready: isReady, cfg:cfg});
				}
				
				self.emit('channel.ready', self);

			});

			function mixinReturn(){

				mixedCount++;
				if(mixedCount==mixinCount){
					isReady = true;
					self.emit('mixins.ready', {cfg: cfg});
				}
			}
			
			if(mixins.length>0){
				for(var mixIdx=0;mixIdx<mixins.length;mixIdx++){
					var mixinCfg = mixins[mixIdx];
			
					self.mixin(mixinCfg, mixinReturn);
				}
			}else{
				isReady = true;
				self.emit('mixins.ready', {cfg: cfg});
			}
			
			
			if(!self.get('id')){
				self.set('id', generateUUID());
			}
			

			self._emit = self.emit;
			
			self.emit = function(topic, data, fn){
				switch(topic){
					case 'newListener':
						self._emit.apply(self, arguments);
						break;
					default:
						var emitData = data;
						if((data instanceof self.constructor)===false){
							emitData = new self.constructor(data);
						}
						self._emit.call(self, topic, emitData);
						break;
				}
			};
			
			/*
			 * End Mixin Loading
			 */
			/*if(callback){
				callback.call(self, {ready: isReady, cfg:cfg});
			}*/
			
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
			
			channel.prototype.get = function(prop, index){
				var self = this;
				return getDataValueByString(self._data, prop);
			};
			
			channel.prototype.set = function(prop, val, index){
				var self = this;
				if(index && (index>=0 || (Array.isArray(index) && index.length===0))){
					var currentValue = getDataValueByString(self._data, prop);
					if(!Array.isArray(currentValue)){
						currentValue = [];
					}

					if((Array.isArray(index) && index.length===0)){
						currentValue.push(val);
					}else{
						currentValue[index]=val;
					}

					self._data = setDataValueByString(self._data, prop, currentValue);
				}else{
					self._data = setDataValueByString(self._data, prop, val);
				}
			};
			
			channel.prototype.init = function(callback){
				if(callback){
					callback(this);
				}
			};
			
			channel.prototype.publish = function(topic, data){
				var self = this;
				var publishers = self._publish;

				if((data instanceof self.constructor)===false){
					data = new self.constructor(data);
				}

				for(var i=0;i<publishers.length;i++){
					var fn = publishers[i];
					fn.call(this, topic, data);
				}
			};
			
			channel.prototype.isa = function(mixin, callback){
				var self = this;
				if(self.mixins[mixin]){
					return true;
				}else{
					return false;
				}
			}

			channel.prototype.requireMixin = function(mixin, mixinCfg, callback){
				var self = this;
				
				if(!self.mixins[mixin]){
					self.mixin(mixin, mixinCfg, callback);
				}
			};
			
			channel.prototype.mixin = function(mixin, mixinCfg, callback){
				var self = this;
				
				if((typeof mixinCfg)=='function'){
					callback = mixinCfg;
					mixinCfg = {};
				}

				if((typeof mixin)=='string'){
					self.getMixin(mixin, function(mixin){

						if((typeof mixin=='object')){
							if(mixin.publish){
								self._publish.push(mixin.publish);
							}
							
							for(var key in mixin){
								switch(key){
									case 'init':
										
										break;
									case 'uninit':
									
										break;
									case 'publish':
										
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
							}else{
								if(callback){
									callback(err, res);
								}
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
								}else{
									if(callback){
										callback(err, res);
									}
								}
							}
						});
					}
				}
			};
			
			channel.prototype.getMixin = function(mixinName, callback){
				var self = this;
				if(self.mixins[mixinName]){

					callback(self.mixins[mixinName])
					//return self.mixins[mixinName];	
				}else{
					if((typeof mixinName)=='object'){
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