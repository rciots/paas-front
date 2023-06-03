const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const session = require('express-session');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;

const mongodb = process.env.MONGODB_CONNECT || 'mongodb://mongodb:27017/userdb';

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected!');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // This will only work if you have https enabled!
    maxAge: 600000 // 1 min
  } 
}));
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const devicesRouter = require('./routes/devices');
app.use('/users', usersRouter);
app.use('/', indexRouter);
app.use('/devices', devicesRouter);

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});