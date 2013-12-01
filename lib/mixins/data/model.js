if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./field', './record'], function(fieldMixin, recordMixin){

	var mixin = {
		name: 'FluxData/data/model',
		//called when first mixing in the functionality
		init: function(cfg, callback){
			var self = this;
			var errs = false;
			var fieldList = false;

			for(var key in cfg){
				if(key==='fields'){
					//we'll deal with these later
					fieldList = cfg.fields;
				}else{
					self.set(key, cfg[key]);
				}
			}

			if(!fieldList){
				fieldList = self.get('fields') || [];
			}


			function fieldLoop(cb){
				var fieldCfg = fieldList.shift();
				if(!fieldCfg){
					if(cb){
						cb();
					}
					return;
				}

				self.addField(fieldCfg, function(){
					fieldLoop(cb);
				});
			}

			fieldLoop(function(){
				if(callback){
					callback(errs, self);
				}
			});
		},
		//called when something is published to this channel
		publish: function(topic, data){
			var self = this;
			
			switch(topic){
				case 'build':
					var newRecord = new self.constructor({
						mixins: [
							{
								type: recordMixin,
								model: self
							}
						]
					});

					//newRecord.once('channel.ready', function(){

					var props = data.get();
					
					for(var key in props){
						newRecord.setValue(key, props[key]);
					}

					data.emit('data.record.built', newRecord, self);
					self.emit('record.built', newRecord);
					//});
					break;
				case 'field':
					self.addField(data);
					break;
			}
		},
		addField: function(name, type, required, hasmany, belongsto, hasone, callback){
			var self = this;
			var cfgObj = false

			if((typeof name)=='object' && (name instanceof self.constructor)===false){
				cfgObj = name;
				required = name.required||false;
				hasmany = name.hasmany||false;
				belongsto = name.belongsto||false;
				hasone = name.hasone||false;
				if((typeof type)=='function'){
					callback = type;
				}else{
					callback = name.callback || false;
				}
				type = name.datatype;
				name = name.name;
			}

			var field;
			
			if((name instanceof self.constructor)===true){
				field = name;
			}else{
				var fieldCfg = {
					mixins:[
						{
							type: fieldMixin,
							datatype: type
						}
					],
					name: name,
					required: required,
					hasmany: hasmany,
					belongsto: belongsto,
					hasone: hasone
				};

				if(cfgObj){
					for(var key in cfgObj){
						if(!fieldCfg[key]){
							fieldCfg[key] = cfgObj[key];
						}
					}
				}

				field = new self.constructor(fieldCfg);
			}
			
			self.set('fields.'+field.get('name'), field);
			
			self.emit('field.added', field);
			
			if(callback){
				callback();
			}
		},
		removeField: function(name){
			var self = this;
			var field = this.get('fields.'+name);
			self.remove('fields.'+name);
			//delete self._data.fields[name];
			self.emit('field.removed', field);
		},
		validate: function(record, callback){
			var self = this;
			var valid = true;
			var errs = [];

			var fields = self.get('fields');
			
			var fieldList = [];
			for(var key in fields){
				fieldList.push(fields[key]);
			}
			
			function validateLoop(){
				if(fieldList.length===0){
					callback(valid, errs);
					return;
				}
				
				var field = fieldList.shift();
				field.validate(record.get(field.name), function(fieldValid, fieldErrs){
					if(!fieldValid){
						valid = false;
						for(var i=0;i<fieldErrs.length;i++){
							errs.push(fieldErrs[i]);
						}
					}
				});
			}
			
			validateLoop();
		},
		validateField: function(fieldName, value, callback){
			var self = this;
			var field = self.get('fields.'+fieldName);
			var valid = true;
			var errs = [];

			if(field){
				field.validate(value, function(isValid, valErrs){
					callback(isValid, valErrs);
				});
			}else{
				//nothing to validate against, so it passes?
				callback(true, []);
			}
		}
	};
	
	return mixin;
});