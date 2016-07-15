"use strict";

require('dotenv').load({silent: true}); // loads environment properties from a .env file for local development

var express = require('express');
var app = express();
var expressBrowserify = require('express-browserify');
var vcapServices = require('vcap_services');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');
var secureOnly = require('express-secure-only');

// Contentful UI is all HTTPS and Chrome also blocks microphone access on http (except localhost)
// Bluemix provides https certificates & termination on *.mybluemix.net domains, so this is all you need
if (app.get('env') === 'production') {
    app.enable('trust proxy');
    app.use(secureOnly());
}

app.set('view engine', 'ejs');

// automatically bundle the front-end js on the fly
// note: this should come before the express.static since bundle.js is in the public folder
app.get('/js/bundle.js', expressBrowserify('./public/js/bundle.js', {
    watch: (app.get('env') === 'development')
}));

// Setup static public directory
app.use(express.static('./public'));


// Watson Speech to Text access token generator
// For local development, replace username and password or set env properties
// When running on bluemix, vcapServices will override these with bluemix-provided credentials
var sttConfig = extend({
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
    username: process.env.SPEECH_TO_TEXT_USERNAME || '<username>',
    password: process.env.SPEECH_TO_TEXT_PASSWORD || '<password>'
}, vcapServices.getCredentials('speech_to_text'));
var sttAuthService = watson.authorization(sttConfig);

app.get('/', function(req, res) {
    sttAuthService.getToken({url: sttConfig.url}, function(err, token) {
        if (err) {
            console.log('Error retrieving token: ', err);
            res.status(500).send('Error retrieving token');
            return;
        }
        res.render('index', {token: token});
    });
});


var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('server listening on http://localhost:%s/', port);
