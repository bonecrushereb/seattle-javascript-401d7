var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.factory('cfAuth', ['$http', '$q', function($http, $q) {
    // DONE: explain what each of these functions are accomplishing and
    // what data we're storing in this service

    /* The removeToken function is setting the token, the username and the localStorage to null. This is used to logout the user.

      The saveToken function sets the given token provided from the sign_up and sign_in to its appropriate token to be used thoughout the app.

      The getToken function returns this.token if given or returns the token from localStorage.

      The getUsername function returns a promise. This promise states that if there is a username return the username and then that promise is resolved. If there is no token available return and reject with an error. the then after the $http get is a custom reject. It is setting this.username to what we get back from the get and then resolving this.username*/

    return {
      removeToken: function() {
        this.token = null;
        this.username = null;
        $http.defaults.headers.common.token = null;
        window.localStorage.token = '';
      },
      saveToken: function(token) {
        this.token = token;
        $http.defaults.headers.common.token = token;
        window.localStorage.token = token;
        return token;
      },
      getToken: function() {
        this.token || this.saveToken(window.localStorage.token);
        return this.token;
      },
      getUsername: function() {
        return $q(function(resolve, reject) {
          if (this.username) return resolve(this.username);
          if (!this.getToken()) return reject(new Error('no authtoken'));

          $http.get(baseUrl + '/api/profile')
            .then((res) => {
              this.username = res.data.username;
              resolve(res.data.username);
            }, reject);
        }.bind(this));
      }
    }
  }]);
};
