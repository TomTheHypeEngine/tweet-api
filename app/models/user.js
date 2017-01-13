'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  followedUsers: Array,
  admin: Boolean,
  password: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
