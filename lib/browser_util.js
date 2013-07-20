// implementation from standard node.js 'util' module
define(function(){
	return {
		inherits: function inherits(ctor, superCtor) {
		    ctor.super_ = superCtor
		    ctor.prototype = Object.create(superCtor.prototype, {
		    	constructor: {
		        	value: ctor,
		        	enumerable: false,
		        	writable: true,
					configurable: true
				}
			})
		}	
	}
});