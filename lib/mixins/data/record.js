if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
	var mixin = {
		name: 'FluxData/data/record',
		//called when first mixing in the functionality
		init: function(cfg, callback){
			var self = this;
			var errs = false;
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}

			if(callback){
				callback(errs, self);
			}
		},
		//called when something is published to this channel
		publish: function(topic, data){
			
		},
		setValue: function(name, value, index){
			var self = this;
			var model = self.get('model');

			if(model){
				//validate first
				var field = model.get('fields.'+name);
				if(field){
					field.setValue(self, value, index);	
				}
			}else{ //no validation required
				self.set('values.'+name, value, index);
			}
		},
		getValue: function(name, index){
			var self = this;
			var model = self.get('model');
			if(model){
				var field = model.get('fields.'+name);
				return field.getValue(self, index);
			}else{
				return self.get('values'+(name?'.'+name:''), index);
			}
		},
		clearValue: function(name, index){

		},
		/**
		 * Retrieve this records data from a collection
		 * @param  {FluxData/data/collection}   collection the collection to retrieve the data from
		 * @param  {Function} callback   called when the data has been retrieved and the internal record data updated
		 */
		fetch: function(collection, callback){
			if((typeof collection)=='function'){
				callback = collection;
				collection = self.get('collection') || (self.get('model')?self.get('model').get('collection'):false);
			}

			if(!collection){
				self.emit('error', new Error('No Collection to fetch from'));
			}else{
				//fetch from the collection
				collection.fetchRecordData(self, function(){
					self.emit('record.fetched', {
						collection: collection
					});
				});
			}
		},
		/**
		 * Save the data in this record to a collection
		 * @param  {FluxData/data/collection}   collection the collection to save the data to
		 * @param  {Function} callback   called when the collection has returned with a response
		 */
		save: function(collection, callback){
			if((typeof collection)=='fucntion'){
				callback = collection;
				collection = self.get('collection') || (self.get('model')?self.get('model').get('collection'):false);
			}

			if(!collection){
				self.emit('error', new Error('No Collection to save to'));
			}else{
				if(collection.get('query')){
					self.emit('error', new Error('Cannot save to queried Collections'));
				}else{
					collection.saveRecordData(self, function(){
						self.emit('record.saved', {
							collection: collection
						});
					});
				}
			}
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
		_changes:[],
		//called when first mixing in the functionality
		init: function(cfg){
			var self = this;
			
			if(cfg.model){
				self.model = cfg.model;
				delete cfg.model;
			}
			
			self.change('init', cfg.data);

			for(var key in cfg.data){
				self.setValue(key, cfg[key]);
			}
		},
		change: function(action, data){
			var self = this;

			self._changes.push({
				action: action,
				data: data
			});
		},
		getChanges: function(){
			var self = this;

			return self._changes;
		},
		setValue: function(field, value){
			var self = this;
			
			if(self.model){
				//validate the field input
				self.model.validateField(field, value, function(isValid, valErrs){
					if(isValid){
						var oldValue = self.get(field);
						self.set(field, value);
						self.change('set', {
							prop: field,
							value: value
						});

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
				
				self.change('set', {
					prop: field,
					value: value
				});

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
	};
	
	return mixin;
});*/