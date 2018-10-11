const db = require("../models");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  // AUTH ROUTES****************************************************
  app.get("/signup", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/index");
    }
    res.render("signup");
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/index");
    }
    res.render("login");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the landing page
  app.get("/index", isAuthenticated, function (req, res) {

    // db.Character.findAll({
    //   where: {
    //     AuthorId: req.user.id
    //   }
    // }).then(function (dbCharacter) {
    //   res.render("createchar", {
    //     username: dbCharacter.username,
    //     stockChoice: dbCharacter.stockChoice
    //   });
    // });

  });


  // GAME ROUTES*****************************************************
  // Load index page
  app.get("/", function (req, res) {
    if (req.user) {
      return res.redirect("/index");
    }
    // db.Character.findAll({}).then(function (dbCharacter) {
    //   res.render("landing", {
    //     msg: "Welcome!",
    //     // username: dbCharacter.username,
    //     // stockChoice: dbCharacter.stockChoice,
    //     // stockPrice: (dbCharacter.totalValue * (1 + parseFloat(dbCharacter.stockPrice))).toFixed(2)
    //     // // examples: dbExamples
    //   });
    // });
    res.render("landing", {
          msg: "Welcome!" });
  });

  // Load index page
  app.get("/index", function (req, res) {
    if (!req.user) {
      return res.redirect("/landing");
    }
    db.Character.findAll({}).then(function (dbCharacter) {
      res.render("index", {
        msg: "Welcome!",
        // username: dbCharacter.username,
        // stockChoice: dbCharacter.stockChoice
        // // examples: dbExamples
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};