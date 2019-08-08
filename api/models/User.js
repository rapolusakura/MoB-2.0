const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean, 
    default: false
  },
  signUpDate: {
    type: Date,
    default: Date.now()
  }, 
  isVerified: {
    type: Boolean, 
    default: false
  }, 
  phoneNumber: Number, 
  employer: {
    type: String, 
    default: null
  }, 
  firstTimeLoggingIn: {
    type: Boolean, 
    default: true
  },
  defaultOriginAddress: String, 
  defaultDestAddress: String
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UserSchema);

module.exports = User; 