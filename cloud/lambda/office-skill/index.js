'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.f9500091-e6e3-447d-b533-7a3148ebe1e6";
const HELP_MESSAGE = 'You can ask facts about the status of the office.';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Ok Goodbye!';



const handlers = {
    'OnlineUsersIntent': function () {
        const speechOutput = "Jack and Jill are now in the office";
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
