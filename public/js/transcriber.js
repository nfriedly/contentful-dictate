const recognizeMicrophone = require('watson-speech/speech-to-text/recognize-microphone');
const getModels = require('watson-speech/speech-to-text/get-models');

module.exports = class Transcriber {

    constructor(token, outputElement) {
        // warning: tokens expire after an hour
        this.token = token;
        this.outputElement = outputElement;
        this.model_id = 'en-US_BroadbandModel';
    }

    startRecording() {
        this.stream = recognizeMicrophone({
            token: this.token,
            // output text to this element, with live updates
            outputElement: this.outputElement,
            // keep previous text in the textarea
            clear: false,
            // firefox pops up a new permissions prompt every time we open the mic, so this keeps it open and ignored when not recording
            keepMicrophone: navigator.userAgent.indexOf('Firefox') != -1,
            // the model determines the locale
            model: this.model_id
        });
        this.stream.on('error', function(err) {
            console.log(err);
        });
        return this.stream;
    }

    stopRecording() {
        this.stream && this.stream.stop();
    }

    /**
     * Sets the model, and by extension the locale, used to transcribe speech based on the given locale.
     *
     * This is a "best effort" function - it first attempts an exact match, then a "first 2 letter match" (e.g. es_MX might become es_ES)
     * If no match is found, the service defaults to an en_US model.
     *
     * @param {String} locale - en-US, en-GB, es-MX, etc.
     */
    setLocale(locale) {
        getModels({token: this.token}).then( models => {
            // The Speech to Text service supports both broadband and narrowband models.
            // Broadband is more appropriate here (narrowband is mainly for telephones)
            models = models.filter(model => model.name.includes('Broadband'));

            // two separate searches because we don't want to settle for a language-only match if a lang-country match was farther down the list
            const exactMatch = model => model.language === locale;
            const languageMatch = model => model.language.substr(0,2) === locale.substr(0,2);
            let model = models.find(exactMatch) || models.find(languageMatch);
            if (model) {
                this.model_id = model.name;
            }
        });
    }
};
