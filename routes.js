const router = require('express').Router();
const controller = require('./controllers/appController')

router.get('/', controller.homeController);

router.post('/initiate_login', controller.loginController);

router.post('/launch', controller.validateLaunch);

router.get('/launch', controller.launchTool);

router.get('/activity', controller.activity);

router.get('/list-item-service', controller.listItemService)

module.exports = router;
