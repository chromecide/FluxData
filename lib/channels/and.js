;!function(exports, undefined) {
	
	var channel = {
		name: 'and',
		publish: function(entity){
			
			entity = this.ensureEntity(false, entity);
			
			if(!this.firstEntity){
				
				this.firstEntity = entity;
			}else{
				var returnEntity = new this._Entity(new this._Model({
					name: 'andEntity', 
					fields: [
						{
							name: 'entity1',
							type: 'entity'
						},
						{
							name: 'entity2',
							type: 'entity'
						}
					]
				}));
				
				returnEntity.set('entity1', this.firstEntity);
				returnEntity.set('entity2', entity);
				
				this.emit('entity', returnEntity);
				delete this.firstEntity;
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