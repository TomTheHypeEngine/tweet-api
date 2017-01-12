'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  admin: Boolean,
  password: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
