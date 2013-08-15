if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
	var mixin = {
		//called when first mixing in the functionality
		init: function(cfg){
			var self = this;
			
			if(cfg.model){
				self.model = cfg.model;
				delete cfg.model;
			}
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}
		},
		setValue: function(field, value){
			var self = this;
			
			if(self.model){
				//validate the field input
				self.model.validateField(field, value, function(isValid, valErrs){
					if(isValid){
						var oldValue = self.get(field);
						self.set(field, value);	
						self.emit('value.set', {
							'old': oldValue,
							'new': value
						});
					}else{
						self.emit('setvalue.error', valErrs);
					}
				});
			}else{//no validation required
				var oldValue = self.get(field);
				self.set(field, value);
				self.emit('value.set', {
					'old': oldValue,
					'new': value
				});
			}
		},
		getValue: function(field){
			var self = this;
			
			return self.get(field);
		},
		addValue: function(field, value){ 
			//TODO: add a data value to a field that is hasmany==true
		},
		removeValue: function(field, value){
			//TODO: remove a data value to a field that is hasmany==true
		},
		//called when something is published to this channel
		publish: function(topic, data){
			//what happens when you publish data to a channel
		},
		validate: function(model, callback){
			var self = this;
			//validate the record properties against the model
			if(!callback){ //no model supplied, use self.model
				callback = model;
				model = self.model;
			}
			
			if(model){
				model.validate(self, callback);
			}else{
				callback(true, []);
				self.emit('record.valid', model);
			}
		}
	}
	
	return mixin;	
});