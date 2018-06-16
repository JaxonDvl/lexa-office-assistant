'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.10650b65-f0d8-4637-9f2f-ce8da1efd6a2";
const HELP_MESSAGE = 'You can read the temperature or the humidity.';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Ok Goodbye!';



const handlers = {
    'ReadTemperatureIntent': function () {
        const speechOutput = "I am going to read the temperature";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'ReadHumidityIntent': function () {
        const speechOutput = "I am going to read the humidity";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
