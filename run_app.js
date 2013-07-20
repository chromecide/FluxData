var FluxData = require('FluxData');

var appChannels = {}

for(var chanName in FluxData.Channel.channels){
	
	appChannels[chanName] = FluxData.Channel.channels[chanName];	
}

var filename = __dirname+'/fdide_server_project_base.json';

if(process.argv[2]){
	filename = process.argv[2];
}

var appCfg = require(filename);

var appMeshCfg = appCfg.App;

for(var meshName in appCfg){
	//if(meshName!='App'){
		FluxData.Channel.channels[meshName] = appCfg[meshName];
	//}
}
console.log('************************************************************************************************************');
var appMesh = new FluxData.Channel({
	name: 'App',
	type: 'App'
}, function(appMesh){
	appMesh.publish({});	
});


//process.exit();

