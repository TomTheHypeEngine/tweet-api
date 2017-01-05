'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let users = fixtures.users;
  let tweets = fixtures.tweets;
  let newUser = fixtures.newUser;
  let loggedInUser = null;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    loggedInUser = tweetService.login(users[0]);
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllTweets();
    tweetService.logout();
  });

  test('create a tweet', function () {
    tweetService.makeTweet(tweets[0]);
    const returnedTweets = tweetService.getTweets(loggedInUser._id);
    console.log(returnedTweets);
    assert.equal(returnedTweets.length, 1);
    assert.isDefined(returnedTweets[0].tweeter);
    assert.equal(returnedTweets[0].tweeter.email, loggedInUser.email);
  });

  test('create multiple tweets', function () {
    for (var i = 0; i < tweets.length; i++) {
      tweetService.makeTweet(tweets[i]);
    }

    const returnedTweets = tweetService.getTweets(loggedInUser._id);
    assert.equal(returnedTweets.length, tweets.length);
    for (var i = 0; i < tweets.length; i++) {
      assert(_.some([returnedTweets[i]], tweets[i]),
          'returned donation must be a superset of donation');
    }
  });

  test('delete all tweets', function () {
    for (var i = 0; i < tweets.length; i++) {
      tweetService.makeTweet(tweets[i]);
    }

    const d1 = tweetService.getTweets(loggedInUser._id);
    assert.equal(d1.length, tweets.length);
    tweetService.deleteAllTweets();
    const d2 = tweetService.getTweets(loggedInUser._id);
    assert.equal(d2.length, 0);
  });

  test('delete tweets', function () {
    for (var i = 0; i < tweets.length; i++) {
      tweetService.makeTweet(tweets[i]);
    }

    tweetService.deleteUserTweets(loggedInUser._id);
    const d = tweetService.getTweets(loggedInUser._id);
    assert.equal(d.length, 0);
  });
});
