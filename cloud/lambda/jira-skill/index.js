'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.82ee05f4-6ac4-4e39-adf9-54287b2a4438";
const CREATE_PROJECT = "Project succefully created";
const HELP_MESSAGE = 'You can work with Jira now, ask me anything.';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Ok Goodbye!';

const JiraApi = require('jira-client');
const fs = require('fs');
const accessData = JSON.parse(fs.readFileSync('access_data.json', 'utf8'));

const jira = new JiraApi({
    protocol: 'http',
    host: 'jira.alintatu.com',
    apiVersion: '2',
    strictSSL: false,
    oauth: {
        consumer_key: "mykey",
        consumer_secret: fs.readFileSync('jira.pem', 'utf8'),
        access_token: accessData["access_token"],
        access_token_secret: accessData["access_token_secret"],
        signature_method: 'RSA-SHA1'
    }
});


const handlers = {
    'CreateProjectIntent': function () {
        const speechOutput = CREATE_PROJECT;
        const projectObj = {
            "key": "SXAM",
            "name": "SExssampleM",
            "projectTypeKey": "business",
            "projectTemplateKey": "com.atlassian.jira-core-project-templates:jira-core-project-management",
            "description": "Example 2 Project description",
            "lead": "tatualindvl",
        };
        jira.createProject(projectObj)
        .then(issue => {
            console.log(`Status: ${issue}`);
        })
        .catch(err => {
            console.error(err["message"]);
        });
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
