const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
dotenv.config();

const initPassport = require('./config/passport');
initPassport(passport);

const app = express();
mongoose.connect(process.env.MONGO_URI);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/todos'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
