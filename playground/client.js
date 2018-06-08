const jiraOps = require('./jira-operations');

jiraOps.createProject("Evergree", "tatualindvl", "business")
    .then(resp => {
        console.log(resp);
    })
    .catch(err => {
        console.log(err);
    })




