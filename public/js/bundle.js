// Quick and dirty.
// Anything more complex would deserve a real architecture instead of jQuery spaghetti.
"use strict";

/* globals $, token */

// this file is served by express-browserify, so it will have all dependencies bundled in automatically
var contentfulExtension = require('contentful-ui-extensions-sdk');
var recognizeMicrophone = require('watson-speech/speech-to-text/recognize-microphone');

var $textarea = $('textarea');
var $button = $('button');
var $btnText = $button.find('span');

// set up the contentful UI extensions SDK
var extension;
contentfulExtension.init(function (ext) {
    extension = ext;
    extension.window.startAutoResizer();
    initText(extension.field.getValue());
});

function initText(text) {
    console.log('recieved text', text);
    $textarea.val(text);
}

function sendText() {
    var text = $textarea.val();
    console.log('sending text', text);
    extension && extension.field.setValue(text);
}

// wire things up

// this is for when someone fiddles with the text
$textarea.on('change', sendText);

var isRecording = false;
$button.click(function() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
    isRecording = !isRecording;
    $btnText.text(isRecording ? 'Stop Dictation' : 'Start Dictation');
    $button.toggleClass('btn-danger', isRecording).toggleClass('btn-primary', !isRecording);
});

var stream;
function startRecording() {
    stream = recognizeMicrophone({
        token: token,
        // output text to this element, with live updates
        outputElement: $textarea[0],
        // keep previous text in the textarea
        clear: false,
        // firefox pops up a new permissions prompt every time we open the mic, so this keeps it open and ignored when not recording
        keepMicrophone: navigator.userAgent.indexOf('Firefox') != -1
    });
    stream.on('error', function(err) {
        console.log(err);
    });
    stream.on('end', sendText);
}

function stopRecording() {
    stream && stream.stop();
}
