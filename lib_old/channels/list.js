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
		items:[],
		publish: function(topic, entity){
			
			switch(topic){
				case 'add':
					console.log('ADDING');
					this.items.push(entity);
					break;
				case 'done':
					console.log('DONE');
					this.emit('entity', this.items);
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