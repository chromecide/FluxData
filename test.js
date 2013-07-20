var FluxData = require('./index.js');

var testChan = new FluxData.Channel({
        "name": "App",
        "type": "mesh",
        "inputs": [],
        "outputs": [],
        "channels": [
            {
                "name": "Webserver",
                "type": "http.server",
                "port":8081,
                "x": 111,
                "y": 203
            },
            {
                "name": "logger",
                "type": "console_log",
                "x": 112,
                "y": 400
            }
        ],
        "links": [
            {
                "name": "Publish",
                "source": "Entity",
                "target": "Webserver",
                "target_in": "publish"
            },
            {
                "name": "Webserver",
                "source": "Entity",
                "target": "logger",
                "target_in": "publish"
            }
        ],
        "attributeLinks": [],
        "scale": 1
    }
);

testChan.on('entity', function(){
	console.log('AND FIRED');
});

testChan.publish('entity', testChan.ensureEntity({}));

