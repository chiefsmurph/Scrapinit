/* server must be running when you executes the tests 
  run the test with "mocha apiSpecs.js" */
var serverHost = 'http://localhost:3000';
var should = require('should');
var assert = require('assert');
var supertest = require('supertest');
var request = supertest(serverHost);
var Sequelize = require('sequelize');
var db = require('../dbConfig');
var bcrypt = require('bcrypt');
var utils = {
  testUser: {
    email: "testemail@gmail.com",
    password: '123qwe'
  },

  createAgent: function(server) {
    var server = server || serverHost
    return supertest.agent(server);
  },

  signUpUser: function (credentials, callback) {
    request.post('/signup')
    .send(credentials)
    .end(function(err, res) {
      if (callback) {
        if (err) {
          callback(err);
        }
        else {
          callback();
        }
      }
    });
  },

  destroyUser: function (schema, credentials, callback) {
    schema.find({where: {email: this.testUser.email}})
    .then(function(foundUser) {
      if (foundUser) {
        foundUser.destroy().then(function() {
          callback();
        });
      }
      else {
        callback();
      }
    });
  },

  logInAgent: function (agent, credentials, callback) {
    agent.post('/api/users/login')
    .send(credentials)
    .end(function(err, res) {
      if (callback) {
        if (err) {
          callback(err);
        }
        else {
          //user object can be accessed in callback
          callback(res.body);
        }
      }
    });
  },

  logOutAgent: function (agent, callback) {
    agent.get('/api/users/logout')
    .end(function(err, res) {
      if (callback) {
        if (err) {
          callback(err);
        }
        else {
          callback();
        }
      }
    });
  }
};

describe('URL LIST', function () {
  var sequelize = db.connect('../db/db.sqlite');
  //pass the the second parameter as false so that the function does not execute sync()
  var schemas = db.createSchemas(sequelize,false);
  //schemas that will be used to execute queries
  var User = schemas.User;
  var Url = schemas.Url;
  var UserUrl = schemas.UserUrl;

  //deletes inserted user from database after all tests are complete
  after(function(done) {
    utils.destroyUser(User, utils.testUser, function () {
      done();
    });
  });

  describe('URLS', function () {

    describe('Route /api/users/list_urls', function () {

      it('should return 401 when there are not a user logged and try request', function (done) {
        request.get('/api/users/list_urls')
        .expect(401)
        .end(function (err, res) {
          done();
        });
      });

      it('should return 401 when user just logged out and try request', function (done) {
        var agent = utils.createAgent();
        utils.logInAgent(agent, utils.testUser, function (user) {
          utils.logOutAgent(agent, function () {
            request.get('/api/users/list_urls')
            .expect(401)
            .end(function (err, res) {
              done();
            });
          });
        });
      });

      it('should return 200 when there are a user logged and try request', function (done) {
        var agent = utils.createAgent();
        utils.logInAgent(agent, utils.testUser, function (user) {
          request.get('/api/users/list_urls')
          .expect(200)
          .end(function (err, res) {
            var result = res.body;
            result.should.have.property('listUrls');
            Array.isArray(result.listUrls).should.equal(true);
          });
        });
      });

      
    });

  });

 
});
