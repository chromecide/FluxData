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
		/**
		 * Core FluxData Object
		 * @class Channel
		 * @constructor
		 * @param  {Object}   cfg      optional Channel configuration object
		 * @param  {Function} callback optional callback function to be called when the Channel is ready
		 */
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
				/**
				 * emitted when all init has been complete
				 * @event channel.ready
				 * @param {Object} Channel `this`
				 */
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
			
			self.emit = function(topic, data, caller, fn){
				if((typeof caller)=='function'){
					fn = caller;
					caller = false;
				}

				if(!caller){
					caller = self;
				}

				switch(topic){
					case 'newListener':
						self._emit.apply(self, arguments);
						break;
					default:
						var emitData = data;
						if((data instanceof self.constructor)===false){
							emitData = new self.constructor(data);
						}
						self._emit.call(self, topic, emitData, caller);
						break;
				}
			};
			
			/*
			 * End Mixin Loading
			 */
			/*if(callback){
				callback.call(self, {ready: isReady, cfg:cfg});
			}*/
			return this;
		}
			
			util.inherits(channel, (EventEmitter2&&EventEmitter2.EventEmitter2)?EventEmitter2.EventEmitter2:EventEmitter2);
		
			/**
			 * Loaded Mixins
			 * @property {Object} mixins
			 */
			channel.mixins = mixinTypes;
			
			/**
			 * Generates a UUID
			 * @method generateUUID
			 * @return {string} Generated UUID
			 */
			channel.generateUUID = generateUUID = function(){
				var d = new Date().getTime();
				var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = (d + Math.random()*16)%16 | 0;
					d = Math.floor(d/16);
					return (c=='x' ? r : (r&0x7|0x8)).toString(16);
				});

				return uuid;
			};
			
			/**
			 * Register a mixin path
			 * @method registerMixin
			 * @param  {string} name  dot seperated path for the mixin e.g. 'mymixin.submodule'
			 * @param  {mixin} mixin the mixin object to register
			 */
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
			
			/**
			 * Get a stored data value
			 * @method get
			 * @param  {string} prop  name of the data value to retrieve
			 * @param  {[type]} index optional array index
			 * @return {mixed}       value of the data value
			 */
			channel.prototype.get = function(prop, index){
				var self = this;
				return getDataValueByString(self._data, prop);
			};
			
			/**
			 * Set a stored data value
			 * @method set
			 * @param {string} prop  the name of the data value to store
			 * @param {mixed} val   the value to store
			 * @param {number} index optional array index
			 */
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
			
			/**
			 * Channel Init function
			 * @param  {Function} callback optional callback. Called when Channel init is complete
			 * @return {[type]}            [description]
			 */
			channel.prototype.init = function(callback){
				if(callback){
					callback(this);
				}
			};
			
			/**
			 * Connect an event to another channel
			 * @method connect
			 * @param  {mixed}   channelObj the target channel to publish the event to
			 * @param  {Array}   topics     an array of topics to listen for
			 * @param  {Object}   options    connection configuration object (see below)
			 * @param  {Function} callback   optional callback function. called when all connections have been made
			 * @return {Object}              this
			 * @example
			 * var chan1 = new FluxData.Channel({});
			 * 
			 * var chan2 = new FluxData.Channel({});
			 *
			 * chan1.connect(chan2, 'My.Topic');
			 */
			channel.prototype.connect = function(channelObj, events, options, callback){
				var self = this;

				var errs = [];
				
				if((typeof options)=='function'){
					callback = options;
					options = {};
				}

				if(!options){
					options = {};
				}


				var connectFunc = function(data){
					//if the channel is not an instance of FluxData.Channel,
					//we instantiate it when the event is called
					if((channelObj instanceof self.constructor)===false){
						channelObj = new self.constructor(channelObj);
					}

					//if no stargetTopic was passed in, set the topic to whatever this event was
					if(!options.targetTopic){
						options.targetTopic = this.event;
					}

					//publish the event to the target channelObj
					channelObj.publish(options.targetTopic, data);
				};

				if(events==='*'){
					self.onAny(connectFunc);
				}else{
					if((typeof events)==='string'){
						self.on(events, connectFunc);
					}else{
						for(var i=0;i<events.length;i++){
							self.on(events[i], connectFunc);
						}
					}
				}
				
				if(callback){
					if(errs.length===0){
						errs = false;
					}
				
					callback(errs, self);
				}

				return this;
			};

			/**
			 * Publish a topic to the Channel
			 * @method publish
			 * @chainable
			 * @param  {String} topic The topic to publish
			 * @param  {Object} data  An object containing the data to publish
			 */
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

				return this;
			};
			
			channel.prototype.isa = function(mixin, callback){
				var self = this;
				if(self.mixins[mixin]){
					return true;
				}else{
					return false;
				}
			};

			/**
			 * Require a mixin
			 * @method requireMixin
			 * @param  {mixed}   mixin    The mixin type
			 * @param  {Object}   mixinCfg Optional. Mixin Configuration object.
			 * @param  {Function} callback Optional. Called when the required mixin has been mixed
			 */
			channel.prototype.requireMixin = function(mixin, mixinCfg, callback){
				var self = this;
				
				if(!self.mixins[mixin]){
					self.mixin(mixin, mixinCfg, callback);
				}
			};
			
			/**
			 * Mixes in the properties and methods of another object
			 * @method mixin
			 * @param  {String}   mixin    The mixin type
			 * @param  {Object}   mixinCfg Mixin Configuration Object
			 * @param  {Function} callback Optional. Called when the properties and methods have been added to the channel
			 * @return {Object}            this
			 */
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
				return this;
			};
			
			/**
			 * Get a mixin class
			 * @method getMixin
			 * @param  {String}   mixinName The mixin type path
			 * @param  {Function(mixinClass)} callback  Called when the mixin class has been retrieved. `mixinClass` is the Mixin Class or `undefined`
			 */
			channel.prototype.getMixin = function(mixinName, callback){
				var self = this;
				if(self.mixins[mixinName]){

					callback(self.mixins[mixinName]);
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
			
			/**
			 * Set the value of an object property or sub property by string
			 * @private
			 * @param {Object} obj   The object on which to perform the set
			 * @param {String} prop  The property name to set.  Sub properties can be set using a dot separated string. e.g. "property.subproperty"
			 * @param {mixed} value The value to use for the set operation
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
			
			/**
			 * Get the value of an Object property or sub property by string
			 * @private
			 * @method getDataValueByString
			 * @param  {Object} obj  The object on which to perform the get operation
			 * @param  {String} prop The propery name to get.  Sub properties can be retrieved using a dot separated string. e.g. "property.subproperty"
			 * @return {mixed}      The value of the supplied property, or undefined
			 */
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