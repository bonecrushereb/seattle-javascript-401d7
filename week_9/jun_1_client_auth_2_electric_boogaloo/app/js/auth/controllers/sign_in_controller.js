var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('SignInController', ['$http', '$location', 'cfHandleError', 'cfAuth', function($http, $location, handleError, auth) {
    //DONE: how does this differ from the sign_up_controller?
    /* This differs from the sign_up_controller because we are assuming the user already has an account. We are doing the $http to set the headers so that where we have $http as a dependancy inject is not effected. This prevents plain text as well as naming collesions with setting multiple headers.*/
    this.buttonText = 'Sign in to existing user';
    this.errors = [];
    this.authenticate = function(user) {
      $http({
        method: 'GET',
        url: baseUrl + '/api/signin',
        headers: {
          'Authorization': 'Basic ' + window.btoa(user.username + ':' + user.password)
        }
      })
        .then((res) => {
          auth.saveToken(res.data.token);
          auth.getUsername();
          $location.path('/bears');
        }, handleError(this.errors, 'could not sign into user'));
    };
  }]);
};
