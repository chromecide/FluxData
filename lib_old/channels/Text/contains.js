;!function(exports, undefined) {
	
	var channel = {
		name: 'Text.contains',
		params:{
			attribute:{
				name: 'attribute',
				label: 'Attribute',
				type: 'Text'
			},
			value:{
				name: 'value',
				label: 'Value',
				type: 'Text'
			},
			caseSensitive:{
				name: 'caseSensitive',
				label: 'Case Sensitive',
				type: 'Boolean'
			},
			multiLine:{
				name: 'mulitLine',
				label: 'Multiline',
				type: 'Boolean'
			}
		},
		inputs: [
			{
				name: 'value',
				label: 'Set Search Term'
			}
		],
		publish: function(topic, entity){
			var attributeName = this.get('attribute');
			
			if(topic=='value'){
				this.set('value', entity.get('value'));
			}else{
				if(this.get('value')!==undefined){
					var value = entity.get(attributeName);
					var caseSensitive = this.get('caseSensitive');
					var multiline = this.get('multiLine');
					var modifiers = '';
					
					if(caseSensitive!==true){
						modifiers+='i';
					}
					
					if(multiline===true){
						modifiers+='m';
					}
					
					var reg = new RegExp(this.get('value'), modifiers);
					
					var match = value.match(reg);
					if(match){
						this.emit('entity', entity);
					}	
				}	
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