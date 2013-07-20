;!function(exports, undefined) {
	
	var channel = {
		name: 'filter',
		params: {
			query: {
				name: 'query',
				label: 'Query',
				type: 'object',
				hasMany: true
			}
		},
		outputs: [
			{
				name: 'fail'
			}
		],
		publish: function(topic, entity){
			//entity = this.ensureEntity(false, entity);
			var passed = validateEntity(this.query, entity);
			
			if(passed){
				this.emit('entity', entity);
			}else{
				this.emit('fail', entity);
			}
		}
	}
	//var t = {"attribute": "action","operator":"=","value"="login"}
	
	function validateEntity(query, entity){
		var passed = true;
		if((typeof query)=='function'){
			passed = query(entity);
		}else{
			if(Array.isArray(query)){
				for(var i=0;i<query.length;i++){
					var queryItem = query[i];
					
					if(!validateQueryItem(queryItem, entity)){
						passed = false;
						continue; //exit the for
					}
				}
			}else{
				passed = validateQueryItem(query, entity);
			}
		}
		
		return passed;
	}
	
	function validateQueryItem(query, entity){
		
		var passed = true;
		
		var attribute = entity.get(query.attribute);
		var operator = query.operator;
		var value = query.value;
		
		switch(operator){
			case 'contains':
			case 'regex':
			case 'regexp':
				if((value instanceof RegExp)===false){
					value = new RegExp(value);
				}
				passed = value.exec(attribute)?true:false;
				break;
			case 'function':
				if((value instanceof 'function')===false){
					var funcString = 'value = '+value;
					eval(funcString);
				}
				
				passed = value(attribute)
				break;
			case 'equals':
			case '=':
				passed = (value==attribute);
				break;
			case '!=':
				passed = (value!=attribute);
				break;
			case '>':
				passed = (attribute>value);
				break;
			case '>=':
				passed = (attribute>=value);
				break;
			case '<':
				passed = (attribute<value);
				break;
			case '<=':
				passed = (attribute<=value);
				break;
			case 'in':
				throw new Error('in filtering not yet supported');
				break;
			case 'notin':
				throw new Error('notin filtering not yet supported');
				break;
		}
		
		return passed;
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);