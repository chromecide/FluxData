if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
	var mixin = {
		TYPES: {
			STRING: {
				name: 'STRING',
				validator: function(val, callback){
					var valid = true;
					var errs = [];
					if(self.get('required')===true){
						if(self.get('hasmany')===true){
							if(!Array.isArray(val) || val.length===0){
								valid = false;
								errs.push(self.get('name')+' is a required field');
							}
						}else{
							if(!val || val==='' || val===undefined){
								valid = false;
								errs.push(self.get('name')+' is a required field');
							}
						}
					}
					
					if(valid && self.get('hasmany')===true){
						if(!Array.isArray(val)){
							valid = false;
							errs.push('Invalid value supplied for '+self.get('name'));
						}else{
							
							for(var i=0;i<val.length;i++){
								if((typeof val[i])!='string'){
									valid = false;
									errs.push('Invalid value supplied for '+self.get('name')+'(Item '+(i+1)+')');
								}
							}
						}
					}
					
					callback(valid, errs);
				}
			},
			UUID: {
				name: 'UUID',
				validator: function(val, callback){
					callback(true, []);
				}
			},
			NUMBER: {
				name: 'NUMBER',
				validator: function(val, callback){
					callback(true, []);
				}
			},
			BOOLEAN: {
				name: 'BOOLEAN',
				validator: function(val, callback){
					callback(true, []);
				}
			},
			DATE: {
				name: 'DATE',
				validator: function(val, callback){
					callback(true, []);
				}
			},
			TIMESTAMP: {
				name: 'TIMESTAMP',
				validator: function(val, callback){
					callback(true, []);
				}
			},
			PASSWORD: {
				name: 'PASSWORD',
				validator: function(val, callback){
					callback(true, []);
				}
			},
			EMAIL: {
				name: 'EMAIL',
				validator: function(val, callback){
					callback(true, []);
				}
			}
		},
		//called when first mixing in the functionality
		init: function(cfg, callback){
			var self = this;
			var errs = false;

			for(var key in cfg){
				switch(key){
					case 'datatype':
						if((typeof cfg.datatype)=='string'){

							switch(cfg.datatype.toLowerCase()){
								case 'uuid':
									cfg.datatype = self.TYPES.UUID;
									break;
								case 'string':
									cfg.datatype = self.TYPES.STRING;
									break;
								case 'number':
									cfg.datatype = self.TYPES.NUMBER;
									break;
								case 'boolean':
									cfg.datatype = self.TYPES.BOOLEAN;
									break;
								case 'date':
									cfg.datatype = self.TYPES.DATE;
									break;
								case 'timestamp':
									cfg.datatype = self.TYPES.TIMESTAMP;
									break;
								case 'password':
									cfg.datatype = self.TYPES.PASSWORD;
									break;
								case 'email':
									cfg.datatype = self.TYPES.EMAIL;
									break;
							}
						}
						self.set('datatype', cfg.datatype);
						break;
					default:

						self.set(key, cfg[key]);
						break;
				}
			}

			if(callback){
				callback(errs, self);
			}
		},
		validate: function(fieldValue, callback){
			var self = this;
			var valid = false;
			var errMessage = [];
			
			var validateFunction = self.get('datatype').validator;
			 
			validateFunction.call(self, fieldValue, function(valid, errs){
				if(callback){
					callback(valid, errs);
				}
			});
		},
		getValue: function(obj, index){
			var self = this;
			var fieldType = self.get('datatype');

			if(fieldType.get){
				var retValue = fieldType.get.call(this, obj, 'values.'+self.get(name), index);

				return retValue;
			}else{
				return obj.get('values.'+self.get('name'), index);
			}
		},
		setValue: function(obj, value, index){
			var self = this;
			var fieldType = self.get('datatype');

			if(fieldType.set){
				fieldType.set.call(this, obj, 'values.'+self.get(name), index);
			}else{
				
				obj.set('values.'+self.get('name'), value, index);
			}
		},
		//called when something is published to this channel
		publish: function(topic, data){
			
		}
	};

	return mixin;
});
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
	var mixin = {
		TYPES: {
			STRING: {
				name: 'STRING',
				validator: function(val, callback){
					var valid = true;
					var errs = [];
					if(self.get('required')===true){
						if(self.get('hasmany')===true){
							if(!Array.isArray(val) || val.length===0){
								valid = false;
								errs.push(self.get('name')+' is a required field');
							}
						}else{
							if(!val || val==='' || val===undefined){
								valid = false;
								errs.push(self.get('name')+' is a required field');
							}
						}
					}
					
					if(valid && self.get('hasmany')===true){
						if(!Array.isArray(val)){
							valid = false;
							errs.push('Invalid value supplied for '+self.get('name'));
						}else{
							
							for(var i=0;i<val.length;i++){
								if((typeof val[i])!='string'){
									valid = false;
									errs.push('Invalid value supplied for '+self.get('name')+'(Item '+(i+1)+')');
								}
							}
						}
					}
					
					callback(valid, errs);
				}
			},
			UUID: {
				name: 'UUID',
					validator: function(val, callback){
					callback(true, []);
				}
			},
			NUMBER: {
				name: 'NUMBER',
				validator: function(val, callback){
					callback(true, []);
				}
			},
			BOOLEAN: {
				name: 'BOOLEAN',
					validator: function(val, callback){
					callback(true, []);
				}
			},
			DATE: {
				name: 'DATE',
				validator: function(val, callback){
					callback(true, []);
				}
			},
			PASSWORD: {
				name: 'PASSWORD',
					validator: function(val, callback){
					callback(true, []);
				}
			},
			EMAIL: {
				name: 'EMAIL',
				validator: function(val, callback){
					callback(true, []);
				}
			}
		},
		//called when first mixing in the functionality
		init: function(cfg){
			var self = this;
			
			//name
			//type
			//hasmany
			//required
			
			for(var key in cfg){
				switch(key){
					case 'type':
						if((typeof cfg.type)=='string'){
							switch(cfg.type.toLowerCase()){
								case 'uuid':
									cfg.type = self.TYPES.UUID;
									break;
								case 'string':
									cfg.type = self.TYPES.STRING;
									break;
								case 'number':
									cfg.type = self.TYPES.NUMBER;
									break;
								case 'boolean':
									cfg.type = self.TYPES.BOOLEAN;
									break;
								case 'date':
									cfg.type = self.TYPES.DATE;
									break;
								case 'password':
									cfg.type = self.TYPES.PASSWORD;
									break;
								case 'email':
									cfg.type = self.TYPES.EMAIL;
									break;
							}
						}
						break;
					default:
						self.set(key, cfg[key]);
						break;
				}
				
			}
		},
		validate: function(fieldValue, callback){
			var self = this;
			var valid = false;
			var errMessage = [];
			
			var validateFunction = self.get('type').validator;
			 
			validateFunction.call(self, fieldValue, function(valid, errs){
				if(callback){
					callback(valid, errs);
				}
			});
		}
	};
	
	return mixin;
});*/