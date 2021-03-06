'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    tweetService.login(users[0]);
    // tweetService.deleteAllUsers();
  });

  afterEach(function () {
    tweetService.logout();
    // tweetService.deleteAllUsers();
  });

  test('create a user', function () {
    const returnedUser = tweetService.createUser(newUser);
    console.log(returnedUser);
    assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
    assert.isDefined(returnedUser._id);
  });

  test('get user', function () {
    const u1 = tweetService.createUser(newUser);
    console.log(u1);
    const u2 = tweetService.getUser(u1._id);
    console.log(u2);
    assert.deepEqual(u1, u2);
  });

  test('get invalid user', function () {
    const u1 = tweetService.getUser('1234');
    assert.isNull(u1);
    const u2 = tweetService.getUser('012345678901234567890123');
    assert.isNull(u2);
  });

  test('delete a user', function () {
    const u = tweetService.createUser(newUser);
    assert(tweetService.getUser(u._id) != null);
    tweetService.deleteOneUser(u._id);
    assert(tweetService.getUser(u._id) == null);
  });

  // test('get all users', function () {
  //   for (let u of users) {
  //     donationService.createUser(u);
  //   }
  //
  //   const allUsers = donationService.getUsers();
  //   assert.equal(allUsers.length, users.length);
  // });

  test('get users detail', function () {
    for (let u of users) {
      tweetService.createUser(u);
    }

    const allUsers = tweetService.getUsers();
    for (var i = 0; i < users.length; i++) {
      console.log(users[i]);
      console.log(allUsers[i]);
      assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
    }
  });

  test('update user', function () {
    const u1 = tweetService.createUser(newUser);
    assert(tweetService.getUser(u1._id) != null);
    const updateUser = {
      firstName: 'Changed',
      lastName: 'LastName',
      email: 'newMail',
      oldPassword: 'secret',
      password: '123456',
    };
    const updated = { ok: 1, nModified: 1, n: 1 };

    const updatedResp = tweetService.updateOneUser(updateUser, u1._id);
    assert(updatedResp, updated);
    const u3 = tweetService.getUser(u1._id);

    assert(updateUser.firstName === u3.firstName);
    assert(updateUser.password === u3.password);
    assert(updateUser.email === u3.email);
    assert(updateUser.lastName === u3.lastName);
  });

  // test('get all users empty', function () {
  //   const allUsers = donationService.getUsers();
  //   assert.equal(allUsers.length, 0);
  // });
});
