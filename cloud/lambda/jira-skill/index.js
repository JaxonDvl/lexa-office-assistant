'use strict';
const Alexa = require('alexa-sdk');
const jiraOps = require('./jira-operations');

const APP_ID = "amzn1.ask.skill.82ee05f4-6ac4-4e39-adf9-54287b2a4438";
const CREATE_PROJECT = "Project successfully created";
const HELP_MESSAGE = 'You can work with Jira now, ask me anything.';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Ok Goodbye!';



const handlers = {
    'CreateProjectIntent': function () {
        const speechOutput = CREATE_PROJECT;
        const projectName = this.event.request.intent.slots.PROJECT_NAME.value;
        const projectType = this.event.request.intent.slots.PROJECT_TYPE.value;
        const leadManager = this.event.request.intent.slots.LEAD_NAME.value;
        jiraOps.createProject(projectName, leadManager, projectType)
            .then(resp => {
                console.log(resp);
            })
            .catch(err => {
                console.log(err);
            })
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'ReadIssueIntent': function () {
        const issueId = this.event.request.intent.slots.ISSUE_ID.value;
        const issueNumber = this.event.request.intent.slots.ISSUE_NUMBER.value;
        let issueKey = issueId + "-" + issueNumber;
        console.log("issue id",issueId);
        console.log("issue num",issueNumber)
        console.log("issue key",issueKey)
        jiraOps.readIssue(issueKey)
            .then(resp => {
                // let outputSpeech = {
                //     type: 'SSML',
                //     speech: `Issue summary <break time="0.7s" /> ${resp["summary"]}
                //     <break time="0.7s" /> Here we have the issue description <break time="0.7s" ${resp["description"]}/>
                //     `
                // };
                // this.response.speak(outputSpeech);
                this.response.speak(`Issue summary: <break time="0.7s" /> ${resp["summary"]}  <break time="0.7s" />
                 Here we have the issue description: <break time="0.7s" /> ${resp["description"]}`);
                this.emit(':responseReady');
                console.log(resp);
            })
            .catch(err => {
                this.response.speak("An error occurred when trying to find issue.");
                this.emit(':responseReady');
                console.log(err);
            })

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
