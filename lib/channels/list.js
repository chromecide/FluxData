;!function(exports, undefined) {
	
	var channel = {
		name: 'list',
		label: 'List',
		meshGlobal: true,
		inputs: [
			{
				name: 'add',
				label: 'Add Item'
			},
			{
				name: 'remove',
				label: 'Remove Item'
			},
			{
				name: 'done',
				label: 'Done'
			}
		],
		params:{
			attribute: {
				name: 'attribute',
				label: 'Attribute',
				type: 'Text'
			},
			entity: {
				name: 'entity',
				label: 'Entity',
				type: 'entity'
			}
		},
		outputs:[],
		init: function(cfg){
			this.on('add', this.add);
			this.on('remove', this.remove);
			this.on('done', this.done);
		},
		publish: function(entity){
			this.set('entity', entity);
		},
		add: function(entity){
			
		},
		remove: function(entity){
			
		},
		done: function(entity){
			this.emit('entity', this.get('entity'));
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