
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const routes = require('./server/routes/main.js');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();


app.use(express.static('public'));

//todo    Template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(port, () => console.log(`app listening on port ${port}!`));