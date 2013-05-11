;!function(exports, undefined) {
	
	var channel = {
		name: 'foreach',
		outputs:[
			{
				name: 'EOL',
				label: 'End Of List'
			},
			{
				name: 'noitems',
				label: 'No Items'
			}
		],
		publish: function(entity){
			
			var self = this;
			var items = entity.get(self.attribute);
			
			if(Array.isArray(items)){
				if(items.length>0){
					for(var i=0;i<items.length;i++){
						var item = items[i];
						if((item instanceof this._Entity)==false){
							item = new self._Entity(item);
						}
						self.emit('entity', item);
					}
					self.emit('EOL', this.ensureEntity({value: items.length}));
				}else{
					self.emit('noitems', entity);
				}
			}else{
				self.emit('entity', entity);
			}
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