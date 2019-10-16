const platformData = require('../data/platform-registration');
const toolData = require('../data/tool-data');
const nonce = require('nonce-generator');
const jwt = require('jsonwebtoken');
const url = require('url');
let loggedinPlatform;

exports.homeController = (req, res)=>{
    res.render('home.hbs',{
        title: "LTI Tool Provider App"
    })
}

exports.loginController = (req, res) => {
    let platform = platformData[0]

    if (!platform) {
        return res.render('error.hbs', {
            platformNotRegsitered: true
        });
    }
    loggedinPlatform = platform;

    let paramsToSend = {
        "client_id":  platform.client_id,
        "login_hint": req.body.login_hint,
        "lti_message_hint": req.body.lti_message_hint,
        "nonce":  nonce(20),
        "prompt": "none",
        "redirect_uri": toolData.launch_url,
        "response_mode": "form_post",
        "response_type":  "id_token",
        "scope":  "openid"
    };

    let payload = {
        "tool_id": 536,
        "state_nonce": paramsToSend.nonce,
        "params": {
          "iss": req.body.iss,
          "client_id": req.body.client_id,
          "lti_deployment_id": req.body.lti_deployment_id,
          "target_link_uri": toolData.launch_url,
          "login_hint": req.body.login_hint,
          "lti_message_hint": req.body.lti_message_hint,
          "commit": req.body.commit,
          "controller": "lti/login_initiations",
          "action": "create",
          "tool_id": "536"
        },
        "iss": toolData.launch_url,
        "sub": platform.client_id,
        "aud": "",
        "iat": Date.now(),
        "exp": Date.now() + 300,
        "jti": nonce(20)
      };

      paramsToSend.state = jwt.sign(payload, toolData.private_key, { algorithm: 'RS256', keyid:nonce(20)});
    
      return res.render('login.hbs', {
          receivedParams: req.body,
          paramsToSend: paramsToSend,
          action: platform.oidc_auth_url  
      });

    }

exports.validateLaunch = (req, res) => {
    jwt.verify(req.body.id_token, loggedinPlatform.public_key, (err, decoded) => {
        if (err) {
            return res.render('error.hbs', {
                invalidToken: true
            });
        }
        if (decoded["https://purl.imsglobal.org/spec/lti/claim/message_type"] != "LtiResourceLinkRequest" || decoded["https://purl.imsglobal.org/spec/lti/claim/version"] != "1.3.0" || decoded["https://purl.imsglobal.org/spec/lti/claim/deployment_id"] != loggedinPlatform.deployment_id || decoded["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"] != loggedinPlatform.tool_link_url || !(decoded["https://purl.imsglobal.org/spec/lti/claim/resource_link"]) || !(decoded["https://purl.imsglobal.org/spec/lti/claim/roles"])) {
            return res.render('error.hbs', {
                badRequest: true
            });
        }
        return res.redirect(url.format({
            pathname: toolData.display_url,
            query: decoded
          }));
      });
}

exports.launchTool = (req, res) => {
    return res.render('launch.hbs', {
        params: req.query
    });
}