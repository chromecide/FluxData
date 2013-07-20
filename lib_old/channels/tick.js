;!function(exports, undefined) {
	
	var channel = {
		name: 'tick',
		label: 'Tick',
		params:{
			interval: {
				name: 'interval',
				label: 'Interval',
				description: 'Interval in Milliseconds',
				type: 'Number'
			},
			entity: {
				name: 'entity',
				label: 'Entity',
				description: 'The Entity to emit on Tick'
			},
			output: {
				name: 'output',
				label: 'Output',
				description: 'The name of the Output to fire on Tick',
				type: 'Text'
			}
		},
		publish: function(topic, entity){
			var interval = this.get('interval');
			var action = this.get('output');
			
			if(!interval){
				interval = 1000;
			}
			
			if(!action){
				action = 'entity';
			}
			console.log(entity.get());
			if(!entity || entity.get().toString()=='{}'){
				if(this.get('entity') instanceof this._Entity){
					entity = this.get('entity');
				}else{
					if(!this.get('entity')){
						entity = new this._Entity({
							time: new Date()
						});
					}else{
						entity = new this._Entity(this.get('entity'));	
					}
				}
			}
			
			var self = this;
			this._intObj = setInterval(function(act, ent){
				return function(){
					self.emit(act, ent);	
				}
			}(action, entity), interval);
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