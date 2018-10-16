// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
const bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
  var Author = sequelize.define("Author", {
    username: {
      type: DataTypes.STRING,
      validate: {
        isUnique: function (value, next) {

          Author.find({
              where: {
                username: value
              },
              attributes: ['id']
            })
            .done(function (error, user) {
              if (error)
                // Some unexpected error occured with the find method.
                return next(error);
              if (user)
                // We found a user with this email address.
                // Pass the error to the next method.
                return next('Email address already in use!');
              // If we got this far, the email address hasn't been used yet.
              // Call next with no arguments when validation is successful.
              next();
            });
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Author.associate = function (models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Author.hasMany(models.Character, {
      onDelete: "cascade"
    });
  };

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  Author.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  Author.hook("beforeCreate", function (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  return Author;
};