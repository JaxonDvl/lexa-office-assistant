const utils = require('./utils');
const credentials = require('./access_data.json');

const JiraApi = require('./jira');
const fs = require('fs');

const jira = new JiraApi({
    protocol: 'http',
    host: 'jira.alintatu.com',
    apiVersion: '2',
    strictSSL: false,
    oauth: {
        consumer_key: "mykey",
        consumer_secret: fs.readFileSync('jira.pem', 'utf8'),
        access_token: credentials.access_token,
        access_token_secret: credentials.access_token_secret,
        signature_method: 'RSA-SHA1'
    }
});

async function getValidKeyForProject(projectName) {
    try {
        let listOfKeys = [];
        let listOfProjects = await jira.getAllProject();
        listOfProjects.forEach(element => {
            listOfKeys.push(element.key);
        });
        return utils.generateUniqueProjectKey(projectName, listOfKeys);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createProject: async function (projectName, lead, projectType) {
        try {
            let projectKey = await getValidKeyForProject(projectName);
            let projectObject = {
                "key": projectKey,
                "name": utils.capitalize(projectName),
                "projectTypeKey": projectType,
                "lead": lead,
            }
            await jira.createProject(projectObject);
            return "Project successfully created";
        } catch (err) {
            console.log(err);
        }
    },
    readIssue: async function (issueNumber) {
        try {
            let issueObject = {
                "issueNumber": issueNumber
            }
            let response = await jira.findIssue(issueNumber);
            return {
                "summary":response["fields"]["issuetype"]["description"] || "Nothing found",
                "description": response["fields"]["description"] || "Nothing found"
            };
        } catch (err) {
            console.log(err);
        }
    }
}