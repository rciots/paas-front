const express = require('express');
const router = express.Router();
const Device = require('../models/schemas').Device;
const Template = require('../models/schemas').Template;
const User = require('../models/schemas').User;
const Token = require('../models/schemas').Token;
router.use(express.urlencoded({ extended: true }));
// Display list of all devices for the authenticated user.
router.get('/', (req, res, next) => {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.session.user })
      .then((user) => {
        Device.find({ owner: user._id, enabled: true})
          .then((devices) => {
            devices.forEach(device => {
                device.ownername = user.username;
            });
            res.locals.user = req.session.user;
            res.render('devices', { devices: devices });
          })
          .catch((err) => {
            console.error(err);
            return res.json({ message: 'Error' });
          });
      })
      .catch((err) => {
        console.error(err);
        return res.json({ message: 'Error' });
      });
  } else {
    res.redirect('/');
  }
});

router.get('/pending', (req, res, next) => {
    if (req.session.authenticated === true) {
      User.findOne({ username: req.session.user })
        .then((user) => {
          Device.find({ owner: user._id, enabled: false })
            .then((devices) => {
              devices.forEach(device => {
                device.ownername = user.username;
            });
              res.locals.user = req.session.user;
              res.render('devices_pending', { devices: devices });
            })
            .catch((err) => {
              console.error(err);
              return res.json({ message: 'Error' });
            });
        })
        .catch((err) => {
          console.error(err);
          return res.json({ message: 'Error' });
        });
    } else {
      res.redirect('/');
    }
  });

  router.get('/tokens', (req, res, next) => {
    if (req.session.authenticated === true) {
      User.findOne({ username: req.session.user })
        .then((user) => {
          var username = user.username;
          Token.find({ owner: user._id })
            .then((tokens) => {
              res.locals.user = req.session.user;
              res.render('devices_tokens', { tokens: tokens, username: username });
            })
            .catch((err) => {
              console.error(err);
              return res.json({ message: 'Error' });
            });
        })
        .catch((err) => {
          console.error(err);
          return res.json({ message: 'Error' });
        });
    } else {
      res.redirect('/');
    }
  });
  router.get('/tokens-create', (req, res, next) => {
    if (req.session.authenticated === true) {
      User.findOne({ username: req.session.user })
        .then((user) => {
          var username = user.username;
              res.locals.user = req.session.user;
              res.render('devices_tokens_create', { username: username });
        })
        .catch((err) => {
          console.error(err);
          return res.json({ message: 'Error' });
        });
    } else {
      res.redirect('/');
    }
  });

router.post('/token-create', async (req, res) => {
  const name = req.body.name;
  const automatic = req.body.automatic === "on" ? true : false;
  const active = req.body.active === "on" ? true : false;
  const maxdevices = req.body.max;
  const owner = req.body.owner;
  const valid = req.body.datepicker;
  User.findOne({ username: owner })
  .then((user) => {
    console.log(req.body);
    const newToken = new Token({
      name: name,
      automatic: automatic,
      active: active,
      maxdevices: maxdevices,
      owner: user._id,
      valid: valid
    });

    newToken.save()
    .then(function(newToken) {
      console.log(newToken);
      req.session.authenticated = true;
      return res.json({ message: newToken.name + ":" + newToken.token});
    })
    .catch(function(err) {
      console.log(err);
      throw err;
    });
  })

});
router.get('/templates', (req, res, next) => {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.session.user })
      .then((user) => {
        Template.find({ owner: user._id })
          .then((templates) => {
            res.locals.user = req.session.user;
            res.render('devices_templates', { templates: templates });
          })
          .catch((err) => {
            console.error(err);
            return res.json({ message: 'Error' });
          });
      })
      .catch((err) => {
        console.error(err);
        return res.json({ message: 'Error' });
      });
  } else {
    res.redirect('/');
  }
});

router.get('/template-create', (req, res, next) => {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.session.user })
      .then((user) => {
        var username = user.username;
            res.locals.user = req.session.user;
            res.render('devices_templates_create', { username: username });
      })
      .catch((err) => {
        console.error(err);
        return res.json({ message: 'Error' });
      });
  } else {
    res.redirect('/');
  }
});

router.post('/template-create', (req, res, next) => {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.session.user })
      .then((user) => {
        console.log(req.body);
        files = JSON.parse(req.body.files);
        console.log(files);
        const filenames = Object.keys(files);
        var fileschema = [];
        filenames.forEach(filename => {
          var file = {}
          file.name = filename;
          file.content = files[filename];
          fileschema.push(file);
        });
        const template = new Template({
          name: req.body.template,
          description: req.body.description,
          owner: user._id,
          files: fileschema,
        });

        template.save()
          .then((savedTemplate) => {
            console.log(savedTemplate);
            res.redirect(`/devices/templates`);
          })
          .catch((err) => {
            console.error(err);
            return res.json({ message: 'Error' });
          });
      })
      .catch((err) => {
        console.error(err);
        return res.json({ message: 'Error' });
      });
  } else {
    res.redirect('/');
  }
});


router.get('/templates/:id/delete', async (req, res, next) => {
  try {
    if (req.session.authenticated === true) {
      const templateId = req.params.id;
      const foundTemplate = await Device.findById(templateId).exec();
      if (!foundTemplate) {
        console.error(`Template with ID ${deviceId} not found`);
        return res.json({ message: 'Device not found' });
      }
      // check if the user is the owner of the device
      const foundUser = await User.findOne({ username: req.session.user }).exec();
      if (!foundUser) {
        console.error(`User ${req.session.user} not found`);
        return res.json({ message: 'User not found' });
      }
      if (!foundTemplate.owner.equals(foundUser._id)) {
        console.error(`User ${foundUser.username} is not the owner of template ${foundTemplate.name}`);
        return res.json({ message: 'You are not the owner of this template' });
      }
      await Template.deleteOne({ _id: foundTemplate._id }).exec();
      console.log(`Template with ID ${foundTemplate._id} deleted successfully`);
      return res.redirect('/devices/templates');
    }  else {
    res.redirect('/');
      }
  } catch (err) {
    console.error(err);
    return res.json({ message: 'Error' });
  }
});

// Display detail page for a specific device.
router.get('/:id', (req, res, next) => {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.session.user })
      .then((user) => {
        Device.findOne({ owner: user._id, _id: req.params.id })
          .then((device) => {
            Template.find({ owner: user._id})
              .then((templates) => {
                var templatename;
                for (let key in templates) {
                  if (templates[key]._id.equals(device.template)) {
                    templatename = templates[key].name;
                    break;
                  }
                }
                device.ownername = user.username;
                res.locals.user = req.session.user;
                res.render('device_detail', { device: device, templates: templates, seltemplate: templatename });
              })
              .catch((err) => {
                console.error(err);
                return res.json({ message: 'Error' });
              });
          })
          .catch((err) => {
            console.error(err);
            return res.json({ message: 'Error' });
          });
      })
      .catch((err) => {
        console.error(err);
        return res.json({ message: 'Error' });
      });
  } else {
    res.redirect('/');
  }
});

// Display device create form on GET.
router.get('/create', (req, res, next) => {
  if (req.session.authenticated === true) {
    res.render('device_form', { title: 'Create Device' });
  } else {
    res.redirect('/');
  }
});

// Handle device create on POST.
router.post('/create', (req, res, next) => {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.session.user })
      .then((user) => {
        const device = new Device({
          name: req.body.name,
          description: req.body.description,
          owner: user._id,
        });

        device.save()
          .then((savedDevice) => {
            res.redirect(`/devices/${savedDevice._id}`);
          })
          .catch((err) => {
            console.error(err);
            return res.json({ message: 'Error' });
          });
      })
      .catch((err) => {
        console.error(err);
        return res.json({ message: 'Error' });
      });
  } else {
    res.redirect('/');
  }
});

// Display device delete form on GET.
router.get('/:id/delete', async (req, res, next) => {
    try {
      if (req.session.authenticated === true) {
        const deviceId = req.params.id;
        const foundDevice = await Device.findById(deviceId).exec();
        if (!foundDevice) {
          console.error(`Device with ID ${deviceId} not found`);
          return res.json({ message: 'Device not found' });
        }
        // check if the user is the owner of the device
        const foundUser = await User.findOne({ username: req.session.user }).exec();
        if (!foundUser) {
          console.error(`User ${req.session.user} not found`);
          return res.json({ message: 'User not found' });
        }
        if (!foundDevice.owner.equals(foundUser._id)) {
          console.error(`User ${foundUser.username} is not the owner of device ${foundDevice.name}`);
          return res.json({ message: 'You are not the owner of this device' });
        }
        await Device.deleteOne({ _id: foundDevice._id }).exec();
        console.log(`Device with ID ${foundDevice._id} deleted successfully`);
        return res.redirect('/users/profile');
      }  else {
      res.redirect('/');
        }
    } catch (err) {
      console.error(err);
      return res.json({ message: 'Error' });
    }
  });

  
router.get('/:id/edit', (req, res, next) => {
    if (req.session.authenticated === true) {
        const deviceId = req.params.id;
        Device.findById(deviceId, (err, foundDevice) => {
        if (err) {
            console.error(err);
            return res.json({ message: 'Error' });
        }
        if (!foundDevice) {
            console.error(`Device with ID ${deviceId} not found`);
            return res.json({ message: 'Device not found' });
        }
        // check if the user is the owner of the device
        User.findOne({ username: req.session.user }, (err, foundUser) => {
            if (err) {
            console.error(err);
            return res.json({ message: 'Error' });
            }
            if (!foundUser) {
            console.error(`User ${req.session.user} not found`);
            return res.json({ message: 'User not found' });
            }
            if (!foundDevice.owner.equals(foundUser._id)) {
            console.error(`User ${foundUser.username} is not the owner of device ${foundDevice.name}`);
            return res.json({ message: 'You are not the owner of this device' });
            }
            res.locals.user = req.session.user;
            res.render('edit_device', { device: foundDevice });
        });
        });
    } else {
        res.redirect('/');
    }
});
router.post('/:id/edit', (req, res, next) => {
    if (req.session.authenticated === true) {
      if (req.body.template !== undefined) {
        const id = req.params.id;
        const name = req.body.name;
        const templatename = req.body.template;
        User.findOne({ username: req.session.user })
        .then((user) => {
          Template.findOne({ owner: user._id, name: templatename})
          .then((template) => {
            Device.findOneAndUpdate({ owner: user._id, _id: id}, {template: template._id})
            .then((updatedDevice) => {
              console.log(updatedDevice);
              res.redirect('/devices/' + id);
            })
            .catch((err) => {
              console.log(err);
              return res.json({ message: 'Error' });
            });
          })
        })
      } else {
        const id = req.params.id;
        const name = req.body.name;
        const description = req.body.description;
        const owner = req.body.owner;
        files = JSON.parse(req.body.files);
        console.log(files);
        const filenames = Object.keys(files);
        var fileschema = [];
        filenames.forEach(filename => {
          var file = {}
          file.name = filename;
          file.content = files[filename];
          fileschema.push(file);
        });
        console.log(fileschema);
        User.findOne({ username: owner })
          .then((newowner) => {
          console.log(id);
          Device.findOneAndUpdate({ _id: id}, { name: name, description: description, owner: newowner._id, files: fileschema }, { new: true })
            .then((updatedDevice) => {
              console.log(updatedDevice);
              res.redirect('/devices');
            })
            .catch((err) => {
              console.log(err);
              return res.json({ message: 'Error' });
            });
        });
      }
    } else {
      res.redirect("/");
    }
  });
  
  router.get('/:id/delete', (req, res, next) => {
    if (req.session.authenticated === true) {
      const id = req.params.id;
      Device.findOneAndDelete({ _id: id, owner: req.session.userId })
      .then((deletedDevice) => {
        console.log(deletedDevice);
        res.redirect('/devices');
      })
      .catch((err) => {
        console.log(err);
        return res.json({ message: 'Error' });
      });
    } else {
      res.redirect("/");
    }
  });

  router.get('/:id/approve', (req, res, next) => {
    if (req.session.authenticated === true) {
      const id = req.params.id;
      User.findOne({ username: req.session.user })
      .then((user) => {
        Device.findOneAndUpdate({ _id: id, owner: user._id}, { enabled: true }, { new: true })
        .then((updatedDevice) => {
          console.log(id);
          console.log(req.session);
          console.log(updatedDevice);
          res.redirect('/devices');
        })
        .catch((err) => {
          console.log(err);
          return res.json({ message: 'Error' });
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({ message: 'Error' });
      });
    } else {
      res.redirect("/");
    }
  });

  module.exports = router;