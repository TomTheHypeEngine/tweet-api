'use strict';

const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils');

exports.find = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.findOne = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }, '-password').then(user => {
      if (user != null) {
        reply(user);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.findOneWithFollowed = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }, '-password').populate('followedUsers', '-password -followedUsers -admin').then(user => {
      if (user != null) {
        reply(user);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.followUser = {
  /**Requesting User Follows the user in the url**/
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.payload }).then(user => {
      if (user == null) {
        reply(Boom.notFound('user not found'));
      }

      user.followedUsers.push(request.params.id);
      User.update({ _id: request.payload }, user)
          .then(res => {
            reply(res).code(200);
          });
    }).catch(err => {
      reply(Boom.badImplementation('error unfollowing user'));
    });
  },
};

exports.unfollowUser = {
  /**Requesting User Unfollows the user in the url**/
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.payload }).then(user => {
        if (user == null) {
          reply(Boom.notFound('user not found'));
        }

        user.followedUsers.pull(request.params.id);
        User.update({ _id: request.payload }, user)
            .then(res => {
              reply(res).code(200);
            });
      }).catch(err => {
      reply(Boom.badImplementation('error unfollowing user'));
    });
  },
};

exports.create = {

  auth: false,

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },

};

exports.updateUser = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const user = request.payload;
    // console.log(user);
    User.findOne({ _id: request.params.id }).then(existingUser => {
      if (user.oldPassword !== existingUser.password) {
        reply(Boom.badRequest('wrong old password'));
      } else {
        User.update({ _id: request.params.id }, user, { upsert: true, setDefaultsOnInsert: true })
            .then(updatedUser => {
              reply(updatedUser).code(200);
            }).catch(err => {
          reply(Boom.badImplementation('error updating user'));
        });
      }
    });
  },
};

exports.resetUserPassword = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const newPassword = request.payload;
    User.update({ _id: request.params.id }, { password: newPassword }).then(updatedUser => {
      reply(updatedUser).code(200);
    }).catch(err => {
      reply(Boom.badImplementation('error updating user'));
    });
  },
};

exports.deleteAll = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Users'));
    });
  },

};

exports.deleteOne = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(User).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.authenticate = {

  auth: false,

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        const token = utils.createToken(foundUser);
        reply({ success: true, token: token, user: foundUser }).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(400);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },

};
