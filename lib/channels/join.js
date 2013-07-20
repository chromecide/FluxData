;!function(exports, undefined) {
	
	var channel = {
		name: 'join',
		params:{
			count: {
				name: 'count',
				label: 'Join Count',
				type: 'Number'
			},
			meshGlobal: {
				name: 'meshGlobal',
				label: 'Is Mesh Global',
				type: 'Boolean'
			}
		},
		init: function(cb){
			console.log('(((((((((((((((((((((((((    NEW JOINER    )))))))))))))))))))))))))');
			if(this.get('meshGlobal')==undefined){
				this.set('meshGlobal', true);
			}
			this.created = new Date();
			this.created = this.created+' - '+this.created.getMilliseconds();
			cb(this);
		},
		publish: function(topic, entity){
			entity = this.ensureEntity(false, entity);
			
			if(!this.get('count')){
				this.set('count', 2);
			}
			
			if(!this.entities){
				this.entities = [];
			}
			
			this.entities.push(entity);
			if(this.entities.length==this.get('count')){
				var joinedCfg = {};
				for(var i=0;i<this.entities.length;i++){
					for(var name in this.entities[i].get()){
						joinedCfg[name] = this.entities[i].get(name);
					}
				}
				
				var outputEntity = new this._Entity(joinedCfg);
				this.emit('entity', outputEntity);
				this.entities = [];
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