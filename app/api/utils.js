const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secret = 'secretpasswordnotrevealedtoanyone'; //Use your own token here

exports.createToken = function (user) {
  return jwt.sign({ id: user._id, email: user.email }, secret, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

exports.decodeToken = function (token) {
  var userInfo = {};
  try {
    var decoded = jwt.verify(token, secret);
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e) {
  }

  return userInfo;
};

exports.validate = function (decoded, request, callback) {
  User.findOne({ _id: decoded.id }).then(user => {
    if (user != null) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }).catch(err => {
    callback(null, false);
  });
};

exports.getUserIdFromRequest = function (request) {
  var userId = null;
  try {
    const authorization = request.headers.authorization;
    var token = authorization.split(' ')[1];
    var decodedToken = jwt.verify(token, secret);
    userId = decodedToken.id;
  } catch (e) {
    userId = null;
  }

  return userId;
};
