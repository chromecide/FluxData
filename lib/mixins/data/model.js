if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

/*
 * fieldDef = {
 * 		name: 'field name',
 * 		type: 'field type or function
 * }
 */
define(function(){
	var mixin = {
		//called when first mixing in the functionality
		init: function(cfg){
			var self = this;
			self.set('fields', {});
			
			for(var key in cfg){
				switch(key){
					case 'fields':  
						for(var i=0;i<cfg.fields.length;i++){
							self.addField(cfg.fields[i]);
						}
						break;
				}
			}
			
			self.emit('model.ready');
		},
		addField: function(name, type, required, hasmany, callback){
			var self = this;
			
			if((typeof name)=='object'){
				if((typeof type)=='function'){
					callback = type;
				}
				console.log(name);
				hasmany = name.hasmany||false;
				required = name.required||false;
				type = name.type;
				name = name.name;
			}
			
			var field = new self.constructor({
				name: name,
				type: type,
				required: required,
				hasmany: hasmany
			});
			
			self.set('fields.'+name, field);
			
			self.emit('field.added', field);
		},
		removeField: function(name){
			delete self._data.fields[name];
		},
		validate: function(record, callback){
			var valid = true;
			var errs = [];
			
			var fields = self.get('fields');
			
			var fieldList = [];
			for(var key in fields){
				fieldList.push(fields[key]);
			}
			
			function validateLoop(){
				if(fieldList.length==0){
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
	}
	
	return mixin;	
});