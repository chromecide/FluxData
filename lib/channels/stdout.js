;!function(exports, undefined) {
	
	var channel = {
		name: 'stdout',
		init: function(callback){
			var self = this;
			process.stdin.on('data', function(){
				self.emit('entity', arguments);
			});
			
			process.stdin.resume();
			
			if(callback){
				callback();
			}
		},
		publish: function(topic, entity){
			var text = '';
			
			if((typeof entity)=='string'){
				entity = new this._Entity(false, {
					Text: entity
				});
			}else{
				entity = this.ensureEntity(false, entity);
			}
			
			text = entity.get('Value');
			
  			process.stdout.write(text + '\n');
  			
  			this.emit('entity', entity)
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