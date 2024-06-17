
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const routes = require('./server/routes/main.js');

const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();


//%    Static files
app.use(express.static('public'));

//%    Template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(port, () => console.log(`app listening on port ${port}!`));