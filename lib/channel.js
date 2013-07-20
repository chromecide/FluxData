;!function(exports, undefined) {
	var channelTypes = {};
	
	function objectConstructor(EventEmitter2, util){
		function channel(name, type, model, callback){
			var self = this;
			
			switch(typeof name){
				case 'string':'
					
					break;
				case 'object':
					
					break;
			}
			//first process any mixins
			
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
			
			channel.prototype.publish = function(){
				
			}
			
			channel.prototype.mixin = function(mixin, mixinConfig, callback){
				var self = this;
				if((typeof mixin=='object')){
					for(var key in mixin){
						switch(key){
							case 'init':
								
								break;
							case 'uninit':
							
								break;
						}
						if(key!='name' && key!='label' && key!='init' && key!='uninit'){
							this[key] = mixin[key];
						}
					}
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