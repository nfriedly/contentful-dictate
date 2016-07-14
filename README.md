# Contentful Dictate

A UI Extension for [Contentful] that uses [IBM Watson Speech to Text] to enable voice dictation.

Designed to be hosted on [Bluemix].

## Setup:

There are a few different steps to getting this set up. You'll need accounts at [Contentful] and [Bluemix].

The Deploy to Bluemix button completes steps 1-3 automatically:

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/nfriedly/contentful-dictate/)

1. First create a Watson Speech to Text instance on Bluemix.
2. Edit `manifest.yml to have a unique name and use the name of the Speech to Text service instance you created in step 1.
3. Upload your copy of the app via the [Cloud Foundry CLI](https://github.com/cloudfoundry/cli) tool:

  ```
  cf push
  ```
  
  At this point, you should be able to hit the bluemix url and see a working instance of the widget.

4. Edit the `extension.json` file with your server's url, and then follow [the guide] to create your own extension on Contentful.

## Local testing

You'll need to set things up on bluemix to get credentials, but then you can create a `.env` file (based on `.env.example`) or just hard code the credentials into `app.js`. After that, just run `npm start` and visit http://localhost:3000/ to test it out.

## Todo

* Improve the setup instructions
* Switch from bootstrap to Contentful's CSS

[Contentful]: https://www.contentful.com/
[IBM Watson Speech to Text]: http://www.ibm.com/watson/developercloud/speech-to-text.html
[Bluemix]: https://console.ng.bluemix.net/
[the guide]: https://www.contentful.com/r/knowledgebase/ui-extensions-guide/
