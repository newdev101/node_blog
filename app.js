require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override')
const mainRoutes = require('./server/routes/main.js');
const adminRoutes = require('./server/routes/admin.js')
const cookieParser = require('cookie-parser');
const MongooseStore = require('connect-mongo')

const connectDB = require('./server/config/db.js');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

//%    Database connection
connectDB();

//%   Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: true,
     store: MongooseStore.create({
          mongoUrl: process.env.MONGO_URI
     })
}))


//%    Static files
app.use(express.static('public'));

//%    Template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', mainRoutes);
app.use('/',adminRoutes);

app.listen(port, () => console.log(`app listening on port ${port}!`));