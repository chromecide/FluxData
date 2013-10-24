FluxData
========

Mixin based Distributed Event Engine

Usage (NodeJS)
---


Install FluxData

```
npm install chromecide/FluxData
```

Basic Node

```
var FluxData = require('FluxData');

var myNode = new FluxData.Channel({});

myNode.on('MyEvent', function(data){
	console.log('My Event Fired');
	console.log(data);
});

```

Mixing in Functionality

```
var requirejs = require('requirejs');

//create a static web server node at the current working directory

var FluxData = require('FluxData');

var myNode = new FluxData.Channel({
	mixins:[
		{
			type:'FluxData/http/static_server',
			webroot: process.cwd(),
			port: 8080			
		}
	]
});

```

Including external Mixins

```
var FluxData = require('FluxData');

var myMixin = require('/path/to/my/mixin');

var newNode = new FluxData.Channel({
	mixins:[
		{
			type: myMixin
		}
	]
});
```

OR

```
var FluxData = require('FluxData');

var myMixin = require('/path/to/my/mixin');

FluxData.registerMixin('myMixin', myMixin);

var newNode = new FluxData.Channel({
	mixins:[
		{
			type: 'myMixin'
		}
	]
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
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;
        }
    };
    
    return mixin;
});

```

Usage (Browser)
---

Create a FluxData Static Server

```
var FluxData = require('../../FluxData');

var static_server = new FluxData.Channel({
    mixins:[
        {
            type: 'FluxData/http/static_server',
            port: 8080,
            webroot: __dirname,
            //include the path to your FluxData files
            paths: {
                FluxData: __dirname+'/node_modules/FluxData'
            }
        }
    ]
});
```

Index.html

```
<html>
	<head>
		<script src='require.js'></script>
		<script>
			require(['FluxData'], function(FluxData){
				var myChannel = new FluxData.Channel({});
			});
		</script>
	</head>
	<body>
	
	</body>
</html>
```