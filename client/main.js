//
// Subscribe to Server Publications
Meteor.subscribe("games");
Meteor.subscribe("users");
Meteor.subscribe("courses");

//
// Configure Accounts UI
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
});

