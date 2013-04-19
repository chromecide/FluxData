var model = require(__dirname+'/lib/model.js').Model;
var attribute = require(__dirname+'/lib/attribute.js').Attribute;
var entity = require(__dirname+'/lib/entity.js').Entity;
var channel = require(__dirname+'/lib/channel.js').Channel;

exports = module.exports = {
	Model: model,
	Attribute: attribute,
	Entity: entity,
	Channel: channel
}