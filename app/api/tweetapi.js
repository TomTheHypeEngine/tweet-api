'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils');

exports.findTweets = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {

  },
};

exports.findAllTweets = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter').then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

exports.makeTweet = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {

  },
};

exports.deleteUsersTweets = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {

  },
};

exports.deleteOneTweet = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {

  },
};

exports.deleteAllTweets = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {

  },
};
