;!function(exports, undefined) {
	
	if (typeof define === 'function' && define.amd) {	
		define(['/lib/FluxData/lib/model.js', '/lib/FluxData/lib/attribute.js','/lib/FluxData/lib/entity.js', '/lib/FluxData/lib/channel.js'], function(model, attribute, entity, channel){
			var exportObj = {
				Model: model,
				Attribute: attribute,
				Entity: entity,
				Channel: channel
			}
			return exportObj;
		});
	} else {
		/*var model = require(__dirname+'/lib/model.js').Model;
		var attribute = require(__dirname+'/lib/attribute.js').Attribute;
		var entity = require(__dirname+'/lib/entity.js').Entity;*/
		var channel = require(__dirname+'/lib/channel.js').Channel;
		
		exports = module.exports = {
			/*Model: model,
			Attribute: attribute,
			Entity: entity,*/
			Channel: channel
		}
	}
}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);