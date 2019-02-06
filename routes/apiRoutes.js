// ROUTES for users

const db = require("../models");
const passport = require("../config/passport");

module.exports = function (app) {

  // AUTHENTICATION *************************************************************
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the index page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the index page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/index");
  });
  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    //console.log(req.body);
    db.Author.create({
      username: req.body.username,
      password: req.body.password
    }).then(function () {
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  // Route for getting some data about our user to be used client side
  app.get("/api/userdata", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        username: req.user.username,
        password: req.user.password,
        id: req.user.id
      });
    }
  });


  // GAME ROUTES ******************************************************
  // Get all examples
  app.get("/api/characters", function (req, res) {
    db.Character.findAll({}).then(function (dbCharacters) {
      res.json(dbCharacters);
    });
  });

  app.get("/api/characters/:id", function (req, res) {
    db.Character.findOne({ where: { id: req.params.id } }).then(function (dbCharacters) {
      res.json(dbCharacters);
    });
  });

  app.get("/api/authors/:id", function (req, res) {
    db.Character.findAll({ where: { AuthorId: req.params.id } }).then(function (dbCharacters) {
      res.json(dbCharacters);
    });
  });

  // get Author characters by ID
  app.get("/api/authors/:id", function(req, res) {
    //console.log("AuthorId: req.params.id: ", req.params.id, "***************reqparamsid");
    db.Character.findAll({where: { AuthorId: req.params.id } }).then(function(dbCharacters) {
      res.json(dbCharacters);
    });
  });

  // Create a new example
  app.post("/api/characters", function (req, res) {
    db.Character.create(req.body).then(function (dbCharacters) {
      //console.log(dbCharacters);
      res.json(dbCharacters);
    });
  });

  // Delete an example by id
  app.delete("/api/characters/:id", function (req, res) {
    db.Character.destroy({ where: { id: req.params.id } }).then(function (dbCharacters) {
      res.json(dbCharacters);
    });
  });

  app.put("/api/characters/:id", function(req, res) {
    console.log("asd");
    db.Character.update(
        {
            totalValue: req.body.totalValue
        },
        { where: { id: req.params.id } }).then(function(dbCharacters) {
        res.json(dbCharacters);
      });
  });

};

