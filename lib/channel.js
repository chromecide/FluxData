;!function(exports, undefined) {
	var fs = require('fs');
	var EventEmitter2 = require('eventemitter2').EventEmitter2;
	var util = require('util');
	
	var channelTypes = {};
	
	var fileList = fs.readdirSync(__dirname+'/channels/');
	for(var i=0;i<fileList.length;i++){
		var chanType = require(__dirname+'/channels/'+fileList[i]).Channel;
		channelTypes[chanType.name] = chanType;
	}
	
	var entity = require(__dirname+'/entity').Entity;
	var modelCtr = require(__dirname+'/model');
	
	function channel(name, type, model, callback){
		var self = this;
		
		this.Entity = this._Entity = entity;
		this._Model = modelCtr.Model;
		
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
			}
			
			name = name.name;
		}
		
		this.name = name;
		
		var typeOptions = {};
		
		if((typeof type)=='object'){
			typeOptions = type;
			type = typeOptions.type;
		}
		
		this.type = type===undefined?'Memory':type;
		this.model = model===undefined?false: model;
		
		
		EventEmitter2.apply(this, arguments);
		
		getChannel.call(self, channelTypes, this.type, function(err, chanType){
			if(err){
				throw new Error(err);
			}
			
			if(chanType.extend){ //load that first
				getChannel.call(self, channelTypes, chanType.extend, function(err, extChanType){
					for(var key in extChanType){
						self[key] = extChanType[key];
					}
					
					for(var key in chanType){
						self[key] = chanType[key];
					}
					
					if(typeOptions!={}){
						for(var key in typeOptions){
							self[key] = typeOptions[key];
						}
					}
					
					
					self.init(callback);
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
	
		channel.prototype.init = function(callback){
			if(callback){
				callback(this);
			}
		}
	
		channel.prototype.instance = function(data){
			return new entity(this.model, data);
		}
		
		
		channel.prototype.ensureEntity = function(model, data){
			
			if((typeof model=='object') && (model instanceof modelCtr)===false){
				data = model;
				model = false;
			}
			
			if((data instanceof entity)===false){
				data = new entity(model, data);
			}
			
			return data;
		}
		
		channel.prototype.publish = function(data){
			
			this.emit('entity', data);
		}
		
		function channelConnector(remoteChannel){
			return function(data){
				remoteChannel.publish(data);
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
		
		//get the value of a channel setting
		channel.prototype.get = function(name){
			if(name){
				return this[name];	
			}else{
				return this;	
			}
		}
		
		
		//set the value of a channel setting
		channel.prototype.set = function(name, value){
			if(value==undefined){
				value = name;
				name = false;
			}
			
			if(name){
				this[name] = value;
			}else{
				if((typeof value)=='object'){
					for(var key in value){
						this[key] = value[key];
					}
				}else{
					throw new Error('Invalid Value for set: '+__filename);
				}
			}
			
		}
		
		
		channel.prototype.setType = function(model){
			this.model = model
		}
		
		channel.prototype.getType = function(){
			return this.model;
		}
		
		function getChannel(chanTypes, name, callback){
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
		
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}
}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);