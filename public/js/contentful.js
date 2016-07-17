// a few Promise-based wrappers around the Contentful UI Extension SDK

const contentfulExtension = require('contentful-ui-extensions-sdk');

const getExtension = new Promise(function(resolve) {
    contentfulExtension.init(resolve);
});

getExtension.then(function(ext) {
    ext.window.startAutoResizer();
});

exports.getText = function getText() {
    return getExtension.then(ext => ext.field.getValue());
};

exports.setText = function setText(text) {
    return getExtension.then(ext => ext.field.setValue(text));
};

exports.getLocale = function getLocale() {
    return getExtension.then(ext => ext.field.locale);
};
