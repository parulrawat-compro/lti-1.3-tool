"use strict";
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const routes = require('./routes');
const exphbs  = require('express-handlebars');

const app = express();
const port = process.env.PORT || config.port;

app.set('views', __dirname + '/views');
app.engine('.hbs', exphbs({
    extname: '.hbs',
    helpers: require('./handlebars-helpers') 
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ 'extended': true }));

app.use(`/`, routes);

app.listen(port,()=>{
    console.log(`LTI 1.3 Tool listening on port ${port}`);
})
