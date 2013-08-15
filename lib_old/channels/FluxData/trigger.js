;!function(exports, undefined) {
	
	var channel = {
		name: 'FluxData.trigger',
		label: 'Trigger',
		meshGlobal: true,
		inputs:[
			{
				name: 'trigger',
				label: 'Trigger'
			}
		],
		publish: function(topic, entity){
			switch(topic){
				case 'entity':
					this.set('entity', entity);
					if(this.get('triggered')==true){
						this.emit('entity', this.get('entity'));
					}
					break;
				case 'trigger':
					this.set('triggered', true);
					if(this.get('entity'!==undefined)){
						this.emit('entity', this.get('entity'));
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