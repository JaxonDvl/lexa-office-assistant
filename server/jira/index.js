const express = require('express');
const session = require('express-session');
const OAuth = require('oauth').OAuth;
const fs = require('fs');
const app = express();

app.use(session({ secret: 'red', saveUninitialized: true, resave: true }));
app.get('/', function (req, res) {
    res.send("Jira Authenticator");
});
const base_url = "http://jira.alintatu.com";

app.get('/jira', function (req, res) {
    let oa = new OAuth(
        base_url + "/plugins/servlet/oauth/request-token",
        base_url + "/plugins/servlet/oauth/access-token",
        "mykey", fs.readFileSync('jira.pem', 'utf8'), '1.0', "http://206.189.118.65:1337/jira/callback", "RSA-SHA1");
    oa.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret) {
        if (error) {
            console.log(error.data);
            response.send('Error obtaining OAuth access token');
        } else {
            req.session.oa = oa;
            req.session.oauth_token = oauthToken;
            req.session.oauth_token_secret = oauthTokenSecret;
            return res.redirect(base_url + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken);
        }
    });
});

app.get('/jira/callback', function (req, res) {
    if (req.query.oauth_verifier === 'denied') {
        console.log('Error:', { 'oauth_verifier': 'denied' })
        return res.send('Error on authorizing OAuth access token')
    }
    let oa = new OAuth(req.session.oa._requestUrl,
        req.session.oa._accessUrl,
        req.session.oa._consumerKey,
        fs.readFileSync('./jira.pem', 'utf8'),
        req.session.oa._version,
        req.session.oa._authorize_callback,
        req.session.oa._signatureMethod);
    oa.getOAuthAccessToken(
        req.session.oauth_token,
        req.session.oauth_token_secret,
        req.param('oauth_verifier'),
        function (error, oauth_access_token, oauth_access_token_secret, results2) {
            if (error) {
                console.log('Error:', error);
                res.send('Error on accessing OAuth access token');
            } else {
                req.session.oauth_access_token = oauth_access_token;
                req.session.oauth_access_token_secret = oauth_access_token_secret;
                let accessData = {
                    access_token: oauth_access_token,
                    access_token_secret: oauth_access_token_secret
                }
                fs.writeFileSync('access_data.json', JSON.stringify(accessData));
                res.send({
                    message: "successfully authenticated.",
                    access_token: oauth_access_token,
                    secret: oauth_access_token_secret
                });
            }
        });
});

app.listen(1337, function () {
    console.log('Example app listening on port 1337!');
});