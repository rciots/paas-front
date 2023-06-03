const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


var sessionChecker = (req, res, next) => {    
    console.log(req.session);
    if (req.session.authenticated) {
        console.log(`Found User Session`);
        next();
    } else {
        console.log(`No User Session Found`);
        res.redirect('/');
    }
};



  
const User = require('../models/schemas').User;
const Device = require('../models/schemas').Device;
const saltRounds = 10;

const users = [];

router.use(express.urlencoded({ extended: true }));

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log(email);
    User.findOne({ $or: [{username: username}, {email: email}] })
    .then(function(user) {
      if (user) {
        console.log('That username or email is already taken.');
        return res.json({ message: 'That username or email is already taken.'});
      } else {
        const newUser = new User({
          email: email,
          username: username,
          password: password
        });

        newUser.save()
          .then(function(newUser) {
            console.log(newUser);
            req.session.authenticated = true;
            req.session.user = newUser.username;
            return res.json({ message: 'Logged In.', user: newUser.username, authenticated: true});
          })
          .catch(function(err) {
            console.log(err);
            throw err;
          });
      }
    })
    .catch(function(err) {
      throw err;
    });
});
let loginAttempts = {};
router.post('/login', async (req, res) => {
    const ipAddress = req.ip.toString();
    console.log(ipAddress);
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user has exceeded the maximum number of login attempts
    if (loginAttempts[ipAddress] >= 3) {
        // Set a timeout for one minute and return an error response
        setTimeout(() => {
            loginAttempts[ipAddress] = 0;
        }, 60000);
        return res.json({ message: 'Maximum login attempts exceeded. Please try again in a minute.' });
    }

    User.findOne({ username })
    .then((user) => {
        if (!user) {
            console.log("fail!");
            return res.json({ message: 'No user found.', authenticated: false });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            loginAttempts[ipAddress] = (loginAttempts[ipAddress] || 0) + 1;
            return res.json({ message: 'Oops! Wrong password.', authenticated: false });
        }
        req.session.authenticated = true;
        req.session.user = user.username;
        return res.json({ message: 'Logged In.', user: user.username, authenticated: true});
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get('/profile', sessionChecker, (req, res) => {

    if ((req.session.authenticated === true ) && (req.session.user === "admin")){
        Device.find()
        .then((foundDevices) => {
            var promises = [];
            var devices = [];
            foundDevices.forEach((device) => {
                var promise = User.findOne({ _id: device.owner })
                    .then((user) => {
                var dev = {id: device._id, owner : user.username, online: device.online, name : device.name, description : device.description, created : device.createdAt };
                devices.push(dev);
                    })
                    .catch((err) => {
                    console.log(err);
                    return res.json({ message: 'Error' });
                });
                promises.push(promise);
            });

            Promise.all(promises) // Wait for all promises to resolve
            .then(() => {
              console.log("devices: ");
              console.log(devices);
              res.locals.user = req.session.user;
              res.locals.email = "admin@rciots.com";
              res.render('profile', { devices: devices });
            })
            .catch((err) => {
              console.log(err);
              return res.json({ message: 'Error' });
            });
    

        })
        .catch((err) => console.error(err));
    } else if (req.session.authenticated === true ){
        console.log(req.session);
        User.findOne({ username: req.session.user })
        .then((user) => {
            Device.find({ owner: user._id })
            .then((foundDevices) => {
                var devices = [];
              foundDevices.forEach((device) => {
                var dev = {id: device._id, owner : user.username, online: device.online, name : device.name, description : device.description, created : device.createdAt };
                console.log(dev);
                devices.push(dev);
              });

              res.locals.user = req.session.user;
              res.locals.email = user.email;
              res.render('profile', { devices: devices });
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => {
            console.log(err);
            return res.json({ message: 'Error' });
        });
    }else{
        res.redirect("/");
    }

  });

  router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });
  
  module.exports = router;
  