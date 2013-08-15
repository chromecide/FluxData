if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
	var mixin = {
		TYPES: {
			STRING: function(val, callback){
				var valid = true;
				var errs = []; 
				if(self.get('required')==true){
					if(self.get('hasmany')==true){
						if(!Array.isArray(val) || val.length==0){
							valid = false;
							errs.push(self.get('name')+' is a required field');
						}
					}else{
						if(!val || val=='' || val==undefined){
							valid = false;
							errs.push(self.get('name')+' is a required field');	
						}	
					}
				}
				
				if(valid && self.get('hasmany')==true){
					if(!Array.isArray(val)){
						valid = false;
						errs.push('Invalid value supplied for '+self.get('name'));
					}else{
						
						for(var i=0;i<val.length;i++){
							if((typeof val[i])!='string'){
								valid = false;
								errs.push('Invalid value supplied for '+self.get('name')+'(Item '+(i+1)+')')
							}
						}
					}
				}
				
				callback(valid, errs);
			},
			NUMBER: function(val, callback){
				callback(true, []);
			},
			BOOLEAN: function(val, callback){
				callback(true, []);
			},
			DATE: function(val, callback){
				callback(true, []);
			},
			PASSWORD: function(val, callback){
				callback(true, []);
			},
			EMAIL: function(val, callback){
				callback(true, []);
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
							switch(cfg.type){
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
			
			var validateFunction = self.get('type');
			 
			validateFunction.call(self, fieldValue, function(valid, errs){
				if(callback){
					callback(valid, errs);
				}	
			});
		}
	}
	
	return mixin;	
});