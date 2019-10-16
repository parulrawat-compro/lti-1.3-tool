const router = require('express').Router();
const controller = require('./controllers/appController')

router.get('/', controller.homeController);

router.get('/initiate_login', controller.loginController);

router.post('/launch', controller.validateLaunch);

router.get('/launch', controller.launchTool);

module.exports = router;
