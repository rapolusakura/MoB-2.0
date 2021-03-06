const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isAdmin: {
    type: Boolean, 
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }, 
  employer: {
    type: String, 
    default: null
  }
});

module.exports = mongoose.model('UserSession', UserSessionSchema);