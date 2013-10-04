#!/usr/bin/env node

var appFile = process.argv[2];

console.log(appFile);

var FluxData = require('../FluxData');
var appJSON = require(appFile);

var app = new FluxData.Channel(appJSON);

app.on('error', function(){
    console.log('APP ERROR');
    console.log(arguments);
});