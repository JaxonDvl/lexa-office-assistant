# Server Jira OAuth

Authentication and authorization is required to make secure requests for our Voice Assistant Skill (or any third-party application).

OAuth is the recommended protocol and an industry standard for authorization and limited access for a web-service.

**Consumers** can publish and interact with protected data

**Service Provider** can store protected data on user behalf without spreading their credentials across the web

![OAuth Diagram](https://raw.githubusercontent.com/JaxonDvl/lexa-office-assistant/master/server/jira/oauth1-diagram.png "OAuth diagram Flow") <center> [OAuth Authentication Flow] </center>

 [OAuth Authentication Flow]:https://oauth.net/core/1.0/#anchor9

 
## Setup

1. Configure application link on jira server  to our authentication service 
2. RSA key pair generation using open ssl

```
openssl genrsa -out jira.pem 1024
openssl rsa -in jira.pem -pubout -out jira.pub
 ```
3. Add public key to jira service and private key to the authorization service

4. Open authentication link and obtain access_token and access_secret_token. This we will further use to perform secure requests using Voice Assistant Skill.