;!function(exports, undefined) {
	
	var channel = {
		name: 'and',
		label: 'AND',
		meshGlobal: true,
		inputs: [
			{
				name: 'entity1',
				label: 'Entity 1'
			},
			{
				name: 'entity2',
				label: 'Entity 2'
			}
		],
		init: function(callback){
			var self = this;
			self.on('entity1', function(entity){
				console.log('ent1');
				
			});
			
			self.on('entity2', function(entity){
				
			});
			
			if(callback){
				callback(this);
			}
		},
		publish: function(topic, entity){
			var self = this;
			switch(topic){
				case 'entity1':
					self.set('entity1', entity);
					if(self.get('entity2')){
						self.emit('entity', {});
					}
					break;
				case 'entity2':
					self.set('entity2', entity);
					if(self.get('entity1')){
						self.emit('entity', {});
					}
					break;
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