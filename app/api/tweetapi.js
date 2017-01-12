'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils');

exports.findTweets = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.find({ tweeter: request.params.id }).populate('tweeter', '-password')
        .sort('-tweetDate').then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

exports.findAllTweets = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter', '-password')
        .sort('-tweetDate').then(tweets => {
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
    const tweet = new Tweet(request.payload);
    if (tweet.tweeter == null) {
      tweet.tweeter = utils.getUserIdFromRequest(request);
    }

    tweet.tweetDate = new Date();

    tweet.save().then(newTweet => {
      return Tweet.findOne(newTweet).populate('tweeter', '-password');
    }).then(newTweet => {
      reply(newTweet).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error making donation'));
    });
  },
};

exports.deleteOneTweet = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id }).then(result => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing tweet'));
    });
  },
};

exports.deleteUsersTweets = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.remove({ tweeter: request.params.id }).then(result => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },
};

exports.deleteAllTweets = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.remove({}).then(result => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },
};
