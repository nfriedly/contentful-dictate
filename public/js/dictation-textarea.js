// this file is served by express-browserify as the entrypoint for bundle.js
"use strict";

/* globals $, token */

const contentful = require("./contentful");
const Transcriber = require('./transcriber');

const $textarea = $('textarea');
const $button = $('button');
const $btnText = $button.find('span');

// Token is currently set in a global variable in index.ejs
// (it's normally loaded over an AJAX request, but that was giving me CORS trouble that I haven't taken the time to debug.)
// tokens expire after 1 hour, so until the CORS issue is resolved, you'll just have to reload the page after an hour.
const transcriber = new Transcriber(token, $textarea[0]);

// load the initial text
contentful.getText().then(function(text) {
    $textarea.val(text);
});

// setup the locale
contentful.getLocale()
    .then(transcriber.setLocale.bind(transcriber))
    .then(function(status) {
        // todo: call it out of the watson locale doesn't match the contentful locale
        // consider hiding it in other cases once the issue with contentful initially returning the previous locale is resolved
        $('.locale').text(`(${status.watsonLocale})`);
    });

function handleTextChange() {
    contentful.setText($textarea.val());
}

// this is for when the user edits the text
$textarea.on('change', handleTextChange);

// set up the click handler to start/stop dictation
let isRecording = false;
$button.click(function() {
    if (isRecording) {
        transcriber.stopRecording();
    } else {
        // handle the text change on the stream end event rather than when the stop recording button is clicked
        // because the final transcription will come in a few moments after the recording is stopped.
        transcriber.startRecording().on('end', handleTextChange);
    }
    isRecording = !isRecording;
    $btnText.text(isRecording ? 'Stop Dictation' : 'Start Dictation');
    $button.toggleClass('is-recording', isRecording);
});
