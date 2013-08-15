FluxData
========

Mixin based Distributed Event Engine

Usage (NodeJS)
---

Install RequireJS

```
npm install requirejs
```

Install FluxData

```
npm install chromecide/FluxData
```

Basic Node

```
var requirejs = require('requirejs');

require(['FluxData/index'], function(FluxData){
	var newNode = new FluxData.Channel({});
	
	newNode.on('MyEvent', function(myEventData){
		console.log('My Event Fired');
		console.log(myEventData);
	});
});

```

Mixing in Functionality

```
var requirejs = require('requirejs');

//create a static web server node at the current working directory
require(['FluxData/index'], function(FluxData){
	var newNode = new FluxData.Channel({
		mixins:[
			{
				type: 'mixins/http/static_server.js',
				port: 8080,
				webroot: process.cwd()
			}
		]
	});
});

```

Including external Mixins

```
var requirejs = require('requirejs');

process.fdpaths = {
	myMixins: '/Path/to/your/files'
}

//create a static web server node at the current working directory
require(['FluxData/index'], function(FluxData){
	var newNode = new FluxData.Channel({
		mixins:[
			{
				type: 'myMixins/myMixin' //file: '/Path/to/your/files/myMixin.js'
			}
		]
	});
});
```

Defining a Mixin (taken from /lib/mixins/_blank.js)

```
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
	var mixin = {
		//called when first mixing in the functionality
		init: function(cfg){
			var self = this;
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}
		},
		//called when something is published to this channel
		publish: function(topic, data){
		
		}
	}
	
	return mixin;	
});

```