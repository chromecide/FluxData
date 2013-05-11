;!function(exports, undefined) {
	
	var channel = {
		name: 'get',
		params:{
			attribute:{
				name: 'attribute',
				label: 'Attribute',
				type: 'Text'
			},
			valuename:{
				name: 'valuename',
				label: 'Value Name',
				type: 'Text'
			}
		},
		outputs:[
			{
				name: "inputentity",
				label: 'Input Entity'
			}
		],
		publish: function(entity){
			var value = entity.get(this.attribute);
			var returnObj = {};
			
			if(this.get('valuename')){
				returnObj[this.get('valuename')] = value
			}else{
				returnObj['value'] = value
			}
			
			var valueEntity = new this._Entity(returnObj);
			
			this.emit('inputentity', entity);
			this.emit('entity', valueEntity);
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