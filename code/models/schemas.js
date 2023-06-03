const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  email: {
      type: String,
      required: true,
      unique: true,
      validate: {
          validator: function (v) {
              return /\S+@\S+\.\S+/.test(v);
          },
          message: 'Please enter a valid email'
      }
  },
  username: {
      type: String,
      required: true,
      minlength: 3,
      unique: true
  },
  password: {
      type: String,
      required: true,
      minlength: 8
  }
}, { timestamps: true });

userSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(user.password)) {
          return next(new Error('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character, and be at least 8 characters long'));
      }
      bcrypt.genSalt(10, function(err, salt) {
          if (err) return next(err);
          
          bcrypt.hash(user.password, salt, function(err, hash) {
              if (err) return next(err);
              user.password = hash;
              next();
          });
      });
  } else {
      next();
  }
});


const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String},
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' || 'Org' },
  files: [{
      name: { type: String, required: true },
      content: { type: String }
    }]
});  

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  online: {type: Boolean, required: true, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enabled: {type: Boolean, required: true, default: false },
  cert: {
    crt: { type: String},
    key: { type: String}
  },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  files: [{
    name: { type: String, required: true },
    content: { type: String }
  }],
  options: {
    visible: {
      type: Boolean,
      required: true,
      default: true
    },
    token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
    connector: {
      type: [{
        type: String,
        enum: ['option1', 'option2', 'option3']
      }]
    }
  }
}, { timestamps: true });

const orgSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: {
      admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      editors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
  });


const tokenSchema = new mongoose.Schema({
name: { type: String, required: true },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' || 'Org' },
token: { type: String, required: true, unique: true,
  default: () => {
    let token = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.';
    for (let i = 0; i < 64; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }, },
valid: { type: Date, required: true, default: function () {
  const now = new Date();
  return new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
} },
automatic: { type: Boolean, default: false, required: true },
enrolled: { type: Number, default: 0, required: true },
maxdevices: { type: Number, default: 10, required: true },
active: { type: Boolean, default: true, required: true },
template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' }
});  





module.exports = {
  User: mongoose.model('User', userSchema),
  Device: mongoose.model('Device', deviceSchema),
  Org: mongoose.model('Org', orgSchema),
  Token: mongoose.model('Token', tokenSchema),
  Template: mongoose.model('Template', templateSchema)
};