const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const session = require('express-session');
const mongoose = require('mongoose');
var env = require('dotenv').config();
const PORT = process.env.PORT || 8080;
var mongodb = 'mongodb://localhost:27017/userdb';
if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD && process.env.MONGODB_SERVER && process.env.MONGODB_PORT && process.env.MONGODB_DB) {
  mongodb = 'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@' + process.env.MONGODB_SERVER + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB;
}

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
console.log(mongodb);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected!');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    sameSite: 'strict'
  }
};

if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'pre') {
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const pagesRouter = require('./routes/pages');
const devicesRouter = require('./routes/devices');
app.use('/users', usersRouter);
app.use('/', indexRouter);
app.use('/pages', pagesRouter);
app.use('/devices', devicesRouter);

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});