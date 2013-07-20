;!function(exports, undefined) {
	
	var channelTypes = {};
	
	function objectConstructor(EventEmitter2, util, entity, modelCtr){
		function channel(name, type, model, callback){
			var self = this;
			this._middleware = {};
			
			this.Entity = this._Entity = entity;
			this._Model = modelCtr.Model?modelCtr.Model:modelCtr	;
			
			this.mixinList = [];
			
			this.Models = {
				Command: new this._Model({
					name: 'Command',
					fields: [
						{
							name: 'action',
							label: 'Action',
							required: true,
							type: 'Text'
						},
						{
							name: 'entity',
							label: 'entity',
							type: 'Entity',
							required: true
						}
					]
				}),
			}
			
			if((typeof model)=='function'){
				callback = model;
				model = false;
			}
			
			if((typeof type)=='function'){
				callback = type;
				model = false;
				type = false;
			}
			
			if((typeof name)=='object'){
				if(name.callback){
					callback = name.callback;
					delete(name.callback);
				}
				
				if(name.model){
					model = name.model
					delete name.model;
				}
				
				if(name.type){
					type = name; //type options are parsed from this as well
					
					if(name.type._middleware){
						for(var key in name.type._middleware){
							self.set('_middleware.'+key, name.type._middleware[key]);
						}	
					}
				}
				
				name = name.name;
			}
			this.name = name;
			//this.name = name;
			
			var typeOptions = {};
			
			if((typeof type)=='object'){
				typeOptions = type;
				type = typeOptions.type;
			}
			
			this.type = type===undefined?'Memory':type;
			this.model = model===undefined?false: model;
			
			EventEmitter2.call(this, {
				wildcard: true,
				delimiter: '.'
			});
			this.getChannels = function(){
				return channelTypes;
			}
			
			getChannel.call(self, channelTypes, this.type, function(err, chanType){
				if(err){
					throw new Error(err);
				}
				
				if(chanType.extend){ //load that first
					console.log(chanType.name+' : extend : '+chanType.extend);
					getChannel.call(self, channelTypes, chanType.extend, function(err, extChanType){
						
						for(var key in extChanType){
							if(key!='init'){
								switch(key){
									case '_middleware':
										
										for(var mKey in extChanType[key]){
											self.set('_middleware.'+mKey, extChanType[key][mKey]);	
										}
										break;
									default:
										self.set(key, extChanType[key]);
										break;
								}
							}
						}
						
						var extInit = extChanType.init; 
							
						for(var key in chanType){
							//self[key] = chanType[key];
							
							switch(key){
								case '_middleware':
									for(var mKey in chanType[key]){
										self.set('_middleware.'+mKey, chanType[key][mKey]);	
									}
									break;
								default:
									self.set(key, chanType[key]);
									break;
							}
						}
						
						if(typeOptions!={}){
							for(var key in typeOptions){
								switch(key){
									case '_middleware':
										for(var mKey in typeOptions[key]){
											for(var i=0;i<typeOptions[key][mKey].length;i++){
												self.middleware(mKey, typeOptions[key][mKey][i]);	
											}	
										}
										break;
									default:
										self.set(key, typeOptions[key]);
										break;
								}
							}
						}
						
						if(extInit){
							extInit.call(self, function(){
								self.init(callback);
							});
						}else{
							self.init(callback);
						}
					});
				}else{
					for(var key in chanType){
						self[key] = chanType[key];
					}
					
					if(typeOptions!={}){
						for(var key in typeOptions){
							self[key] = typeOptions[key];
						}
					}
					
					self.init(callback);
				}
			});
			
		}
		
			util.inherits(channel, EventEmitter2);
		
			channel.channels = channelTypes;
			channel.registerChannel = function(name, channel){
				channelTypes[name] = channel;
			}
			
			channel.prototype.init = function(callback){
				if(callback){
					callback(this);
				}
			}
			
			channel.prototype.ensureEntity = function(model, data){
				var modelDef = modelCtr.Model?modelCtr.Model:modelCtr;
				if((typeof model=='object') && (model instanceof modelDef)===false){
					data = model;
					model = false;
				}
				
				if((data instanceof entity)===false){
					data = new entity(model, data);
				}
				
				return data;
			}
			
			channel.prototype.getMixins = function(){
				//console.log(this._mixinList);
				return this.mixinList;
			}
			
			channel.prototype.mixin = function(mixin, callback){
				var self = this;
				if((typeof mixin=='object' && mixin.init)){
					for(var key in mixin){
						if(key!='name' && key!='label' && key!='init' && key!='uninit'){
							console.log('SETTING: ', key);
							this[key] = mixin[key];
						}
					}
					mixin.init.call(this, function(err){
						self.mixinList.push(mixin.name);
						if(callback){
							callback(err, this);
						}
					});
				}
			}
			
			channel.prototype.unmix = function(mixin, callback){
				var self = this;
				if((typeof mixin=='object' && mixin.init)){
					mixin.uninit.call(this, function(err){
						for(var key in mixin){
							if(key!='init' && key!='uninit' && key!='name'){
								delete self[key]; 
							}
						}
						
						for(var i=0;i<self.mixinList.length;i++){
							if(self.mixinList[i]==mixin.name){
								self.mixinList.splice(i, 1);
							}	
						}
						if(callback){
							callback(err, self);
						}
					});
					
					
				}
			}
			
			channel.prototype.isMixed = function(mixinName){
				
				for(var i=0;i<this.mixinList.length;i++){
				
					if(this.mixinList[i]==mixinName){
						return true;
					}
				}
				return false;
			}
			
			channel.prototype.publish = function(topic, data){
				this.emit('entity', data);
			}
			
			function channelConnector(remoteChannel){
				return function(data){
					remoteChannel.publish(this.event, data);
				}
			}
			
			channel.prototype.connect = function(eventName, remoteChannel){
				if((typeof eventName)=='object'){
					remoteChannel = eventName;
					eventName = 'entity';
				}
				
				this.on(eventName, channelConnector(remoteChannel));
				return this;
			}
			
			/*
			 * same as connect but returns the remoteChannel
			 */
			channel.prototype.connectTo = function(eventName, remoteChannel){
				if((typeof eventName)=='object'){
					remoteChannel = eventName;
					eventName = 'entity';
				}
				
				this.on(eventName, channelConnector(remoteChannel));
				return remoteChannel;
			}
			
			channel.prototype.connectOnce = function(eventName, remoteChannel){
				if((typeof eventName)=='object'){
					remoteChannel = eventName;
					eventName = 'entity';
				}
				
				this.once(eventName, channelConnector(remoteChannel));
				return this;
			}
			
			/*
			 * same as connect but returns the remoteChannel
			 */
			channel.prototype.connectToOnce = function(eventName, remoteChannel){
				if((typeof eventName)=='object'){
					remoteChannel = eventName;
					eventName = 'entity';
				}
				
				this.once(eventName, channelConnector(remoteChannel));
				return remoteChannel;
			}
			
			channel.prototype.setType = function(model){
				this.model = model
			}
			
			channel.prototype.getType = function(){
				return this.model;
			}
			
			channel.prototype.middleware = function(name, funcOrArgs, callback){
				var self = this;
				if(!callback){//registering
					var mws = [];
					if(self.get('_middleware.'+name)){
						mws = self.get('_middleware.'+name);
					}
					
					mws.push(funcOrArgs);
					self.set('_middleware.'+name, mws);
					if(callback){
						callback.call(self, false);
					}
				}else{//executing
					
					if(self.get('_middleware.'+name)){
						var mw = [];
						var storeMW = self.get('_middleware.'+name);
						for(var i=0;i<storeMW.length;i++){
							mw.push(storeMW[i]);
						}
						
						function middlewareLoop(){
							if(mw.length==0){
								if(callback){
									callback.call(self, false);
								}
								return;
							}
							
							var fn = mw.shift();
							
							if(fn){
								funcOrArgs.push(function(err){
									if(err){
										callback.call(self, true);
									}else{
										middlewareLoop();
									}
								});
								fn.apply(self, funcOrArgs);	
							}
						}
						middlewareLoop();	
					}else{
						callback.call(self, false);
					}
				}
				return self;
			}
			
			
			channel.prototype.get = function(propName){
				if(propName){
					var propParts = false;
					if(propName.indexOf('.')>-1){
						propParts = propName.split('.');
						propName = propParts.shift();
					}
					
					var propAttribute = this._model?this._model.get(propName):false;
					
					if(propAttribute){
						if((propAttribute.type=='entity' || propAttribute.type=='object') && propParts){
							var propValue = propAttribute.get(this, this);
							if(propAttribute.type=='object'){
								return getDataValueByString(this, propParts.join('.'));
							}else{ //entity
								return propValue.get(propParts.join('.'));	
							}
						}else{
							return propAttribute.get(this, this);//use the attribute object to retrievethe value from the data	
						}
					}else{
						if(propParts){
							var propValue = getDataValueByString(this, propName);
							
							return getDataValueByString(propValue, propParts.join('.'));
							
						}else{
							return getDataValueByString(this, propName);
						}
							
					}
				}else{
					var ret = {
						_channelType: this.type
					};
					for(var paramName in this.params){
						ret[paramName] = this.get(paramName);
					}
					return ret;
				}
			}
			
			channel.prototype.set = function(propName, propValue){
				
				//TODO: add support for setting nested values
				var self = this;
				if(propValue==undefined){
					propValue = propName;
					propName = false;	
				}
				
				var propParts = false;
				
				if(propName){
					/*if(propName.indexOf('.')>-1){
						propParts = propName.split('.');
						propName = propParts.shift();
					}*/
					if(this._model){
						var attr = this._model.get(propName);
						if(attr){
							if(attr.type=='entity' && propParts.length>0){
								//retrieve the entity
								var currentVal = this.get(propName);
								
								currentVal.set(propParts.join('.'), propValue);
								
								this.set(propName, currentVal);
							}else{
								attr.set(this, propValue);
								if(!self.suspendChanges){
									self.emit('changed', this, propName);	
								}	
							}	
						}else{
							if(setDataValueByString(this, propName, propValue)){
								if(!self.suspendChanges){
									self.emit('changed', this, propName);	
								}	
							}	
						}
					}else{
						if(setDataValueByString(this, propName, propValue)){
							if(!self.suspendChanges){
								self.emit('changed', this, propName);	
							}
						}	
					}
				}else{
					for(var key in propValue){
						self.set(key, propValue[key]);
					}
					if(!self.suspendChanges){
						self.emit('changed', this, propValue);
					}
				}
			}
			
			channel.prototype.del = function(propName){
				if(propName){
					if(removeDataValueByString(this._data, propName)){
						this.emit('changed', this);
					}
				}else{
					this._data = {};
					this.emit('changed', this);
				}
			}
			
			channel.prototype.add = function(propName, propValue){
				if(propValue==undefined){
					propValue = propName;
					propName = false;
				}
				if(!propName){
					if(addDataValueByString(this._data, propName, propValue)){
						this.emit('changed', this);
					}
				}else{
					if(Array.isArray(this._data)){
						if(this._data){
							this._data = [this._data];
						}else{
							this._data = [];	
						}
							
					}
					
					this._data.push(propValue);
					this.emit('changed', this);
				}
			}
			
			function getChannel(chanTypes, name, callback){
				console.log(arguments);
				if(name){
					if((typeof name)=='object'){
						callback(false, name);
					}else{
						if(name.indexOf('.')>-1){
							var nameParts = name.split('.');
							var subChannel = chanTypes[nameParts.shift()];
							if(subChannel){
								getChannel.call(this, subChannel, nameParts.join('.'), callback);
							}else{
								callback(false, this); //no error, we just couldn't find the channel'
							}
						}else{
							var type = chanTypes[name];
							if(!type){
								type = this;
							}
							callback(false, type);
						}	
					}	
				}else{
					callback(false, this);
				}
			}
			
			/*
		 * DATA SUPPORT FUNCTIONS
		 */
		
		function getDataValueByString(data, nameString){
			var self = this;
			if(nameString!=''){
				if(nameString.indexOf('.')>-1){
					var nameParts = nameString.split('.');
					var currentAttr = nameParts.shift();
					var currentValue;
					if(data){
						currentValue = data[currentAttr];	
					}
					
					var newValue = getDataValueByString(currentValue, nameParts.join('.'));
					
					return newValue;
				}else{
					if(data){
						return data[nameString];	
					}else{
						return data;
					}
					
				}
			}else{
				return;	
			}
		}
		
		function setDataValueByString(data, nameString, value){
			
			var self = this; 
			if(!data){
				data = {};
			}
			if(nameString){
				if(nameString.indexOf('.')>-1){
					var nameParts = nameString.split('.');
					var currentName = nameParts.shift();
					
					data[currentName] = setDataValueByString(data[currentName], nameParts.join('.'), value);
				}else{
					data[nameString] = value;
				}
			}
			
			return data;
		}
		
		function addDataValueByString(data, nameString, value){
			var self = this; 
			if(!data){
				data = {};
			}
			if(nameString){
				if(nameString.indexOf('.')>-1){
					var nameParts = nameString.split('.');
					var currentName = nameParts.shift();
					data[currentName] = setDataValueByString(data[currentName], nameParts.join('.'), value);
				}else{
					if(!Array.isArray(data[nameString])){
						data[nameString] = [];
					}
					data[nameString].push(value);
				}
			}
			
			return data;
		}
		
		function removeDataValueByString(data, nameString, index){
			var self = this;
			
			if(nameString!=''){
				if(nameString.indexOf('.')>-1){
					var nameParts = nameString.split('.');
					var currentAttr = nameParts.shift();
					var currentValue;
					if(data){
						currentValue = data[currentAttr];	
					}
					
					var newValue = removeDataValueByString(currentValue, nameParts.join('.'));
					
					return newValue;
				}else{
					if(data){
						if(Array.isArray(data[nameString])){
							data[nameString].splice(index, 1);
						}else{
							delete data[nameString];	
						}
						
						return true;	
					}else{
						delete data;
						return true;
					}
					
				}
			}else{
				return;	
			}
		}
		
		return channel;
	}
		
	if (typeof define === 'function' && define.amd) {
		define(['/lib/FluxData/node_modules/eventemitter2/lib/eventemitter2.js', '/lib/FluxData/lib/browser_util.js', '/lib/FluxData/lib/entity.js', '/lib/FluxData/lib/model.js'], function(EventEmitter2, util, entity, modelCtr) {
			return objectConstructor(EventEmitter2, util, entity, modelCtr);
		});
	} else {
		var fs = require('fs');
		var EventEmitter2 = require('eventemitter2').EventEmitter2;
		var util = require('util');
		
		
		var fileList = fs.readdirSync(__dirname+'/channels/');
		for(var i=0;i<fileList.length;i++){
			var stat = fs.statSync(__dirname+'/channels/'+fileList[i]);
			if(stat.isDirectory()){
				var chanType = require(__dirname+'/channels/'+fileList[i]).Channels;
				channelTypes[chanType.name] = chanType;
			}else{
				var chanType = require(__dirname+'/channels/'+fileList[i]).Channel;
				channelTypes[chanType.name] = chanType;	
			}
		}
		
		var entity = require(__dirname+'/entity').Entity;
		var modelCtr = require(__dirname+'/model');
		
		exports.Channel = objectConstructor(EventEmitter2, util, entity, modelCtr);
	}
}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);