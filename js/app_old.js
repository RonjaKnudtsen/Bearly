// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bearly.controllers', []); //Create a module with controllers, send this controller to the app.
//To use the controller: angular.module('bearly.controllers').controller('new-controller-name', function($scope...){...})
angular.module('bearly.services', []); 
var app = angular.module('starter', ['ionic', 'firebase', 'bearly.controllers', 'bearly.services']);
/*Listening to the $routeChangeStart (for ngRoute) or $stateChangeStart (for UI Router) event
When a user is not authorized to access the page (because he’s not logged in or doesn’t have the right role), the transition to the next page will be prevented, so the user will stay on the current page. */
app.run(function($ionicPlatform, $rootScope, AUTH_EVENTS, AuthService) {
  firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser){
    console.log("LOGGED IN: " + firebaseUser.email);
    console.log();
  } else {
    console.log("not logged in");
  }
});


  $rootScope.$on('$stateChangeStart', function (event, next){
    console.log(next);
    var authorizedRoles = next.data.authorizedRoles;
    if(!AuthService.isAuthorized(authorizedRoles)){
      event.preventDefault();
      if(AuthService.isAuthenticated()){
        //user is not allowed
        console.log("NOT ALLOWED");
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        //user is not logged in
        console.log("NOT LOGGED IN");
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });


  //IONIC STANDARD CODE: 
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.constant('USER_ROLES', {
  all: '*',
  cub: 'cub',
  bear: 'bear',
  bearmom: 'bear mom'
});

app.config(function($stateProvider, $urlRouterProvider, USER_ROLES){
  $stateProvider
  .state('login',{
    url: "/login",
    templateUrl: "templates/login.html",
    //controller: "login-controller"
/*    data: {
      authorizedRoles : [USER_ROLES.all]
    }*/
  })
  .state('bears',{
    url: "/bears",
    templateUrl: "templates/bears.html",
    controller: "bears-controller",
    data: {
      authorizedRoles : [USER_ROLES.cub, USER_ROLES.bear]
    },
    resolve: {
      auth: function resolveAuthentication(AuthResolver) { 
        return AuthResolver.resolve();
      }
    }
  })
  .state('bear',{
    url: "/bear/:bearId", //Can now use $stateParams in controller. to get {bearId}
    templateUrl: "templates/bear.html",
    controller: "bear-controller",
    data: {
      authorizedRoles : [USER_ROLES.cub, USER_ROLES.bear]
    },
    resolve: {
      auth: function resolveAuthentication(AuthResolver) { 
        return AuthResolver.resolve();
      }
    }
  })
  .state('bear.edit',{
    url: "/bear/:bearId/edit", //Can now use $stateParams in controller. to get {bearId}
    templateUrl: "templates/bear-edit.html",
    controller: "bear-edit-controller",
    data: {
      authorizedRoles : [USER_ROLES.cub, USER_ROLES.bear]
    },
    resolve: {
      auth: function resolveAuthentication(AuthResolver) { 
        return AuthResolver.resolve();
      }
    }
  })
  .state('new',{
    url: "/new",
    templateUrl: "templates/new-bear.html",
    controller: "new-bear-controller",
    data: {
      authorizedRoles : [USER_ROLES.cub, USER_ROLES.bear]
    },
    resolve: {
      auth: function resolveAuthentication(AuthResolver) { 
        return AuthResolver.resolve();
      }
    }
  })
  .state('search',{
    url: "search",
    templateUrl: "templates/search.html",
    controller: "search-controller",
    data: {
      authorizedRoles : [USER_ROLES.cub, USER_ROLES.bear]
    },
    resolve: {
      auth: function resolveAuthentication(AuthResolver) { 
        return AuthResolver.resolve();
      }
    }
  })
  .state('profile',{ //a user profile
    url: "profile/:userId", //Can now use $stateParams in controller. to get {userId}
    templateUrl: "templates/profile.html",
    controller: "profile-controller",
    data: {
      authorizedRoles : [USER_ROLES.cub, USER_ROLES.bear]
    },
    resolve: {
      auth: function resolveAuthentication(AuthResolver) { 
        return AuthResolver.resolve();
      }
    }
  })
  .state('profile.edit',{ //a user profile
    url: "/edit", //will add Edit to profile, so profile/:user/edit
    templateUrl: "templates/profile-edit.html",
    controller: "profile-edit-controller",    
    data: {
      authorizedRoles : [USER_ROLES.cub, USER_ROLES.bear]
    },
    resolve: {
      auth: function resolveAuthentication(AuthResolver) { 
        return AuthResolver.resolve();
      }
    }
    })
  $urlRouterProvider.otherwise('/bears');
});


//Login and authentication
//  https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec#.ijiroxfm1 


app.directive('loginDialog', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    template: '<div ng-if="visible" ng-include="\'templates/login.html\'">',
    link: function (scope) {
      //Change with popup window later
      var showDialog = function () {
        scope.visible = true;
        console.log("SHOW DIALOG");
      };

      scope.visible = false;
      scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);

    //  scope.$on(AUTH_EVENTS.sessionTimeout, showDialog)
    }
  };
});
app.controller('Bearly-Controller', function($scope, USER_ROLES, AuthService){
  $scope.externalScope = {};
  //Fix menu close button.
  $scope.showMenu = function () {
  $ionicSideMenuDelegate.toggleLeft();
  }
  //initialize currentuser, userroles and isauthorized.
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
});
//Constants will hold the events and user roles. 
app.constant('AUTH_EVENTS',{
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});


app.factory('AuthResolver', function ($q, $rootScope, $state) {
  return {
    resolve: function () {
      var deferred = $q.defer();
      var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
        if (angular.isDefined(currentUser)) {
          if (currentUser) {
            deferred.resolve(currentUser);
          } else {
            deferred.reject();
            $state.go('login');
          }
          unwatch();
        }
      });
      return deferred.promise;
    }
  };
});

//Global connection to the firebase server
app.service('firebase', function(firebaseURL, firebaseApiKey, firebaseAuthDomain){
  var app = {}
  var config = {
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    databaseURL: firebaseURL,
    storageBucket: "bearly-7cb64.appspot.com",
    messagingSenderId: "27070482516"
    };
  firebase.initializeApp(config);
  app.rootRef = firebase.database().ref();
  app.auth = firebase.auth();
  //I en controller eller resolve kan auth.signInWithEmailAndPassword(email, pass); brukes
  
  return app;
});
//3 functions: 1. login, 1.5 reister, 2 check if authenticated, 3: check if authorized
app.factory('AuthService', function (firebase, Session){
  var authService = {};
  authService.login = function(credentials){
    const promise = firebase.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
    promise.then(function (res){
      //returns userid provider, token 
      console.log(res);
      console.log(res.uid);
      console.log(res.email);
      console.log()
      Session.create(res.uid, "cub"); //All new users are now cubs. 

      return res.uid;
      //Kan også lage en real time authentication listener fra firebase 
      // https://youtu.be/-OKrloDzGpU?t=542 
    })
    .catch(e=> console.log(e.message));

    return promise;
  };
  authService.register = function(credentials){
    const promise = firebase.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    promise.catch(e=> console.log(e.message));
    return promise;
  }
  authService.isAuthenticated = function (){
    return !!Session.userId; //Get from session service
  };
  authService.isAuthorized = function(authorizedRoles){
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  }
  return authService;
});



app.service('Session', function(){
  this.create = function (userId, userRole) {
    //this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
  //  this.id = null;
    this.userId = null;
    this.userRole = null;
  };
});

app.controller('login-controller', function($scope, $rootScope, AUTH_EVENTS, AuthService, USER_ROLES){
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;

  $scope.setCurrentUser = function(user){
    $scope.currentUser = user;
  };

  $scope.registerform = false;
    $scope.registerclass = "button-clear";
    $scope.loginclass = "";
  $scope.credentials = {
    email: '',
    password: ''
  }; //Get these from the login form.
  $scope.login = function(credentials){
    if($scope.registerform == true){
      $scope.registerclass = "button-clear";
      $scope.loginclass = "";
      $scope.registerform = false;
    } else{
      console.log("LOGIN");
      AuthService.login(credentials).then(function (user){
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        $scope.setCurrentUser(user);
        console.log("success");
      }, function(){
        console.log("LOGIN FAILED");
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    }
  };
  $scope.register = function(credentials){
    if($scope.registerform == false){
      $scope.registerform = true;
      $scope.registerclass = "";
      $scope.loginclass = "button-clear";
    } else{
      //TODO: check for real email address
      if(credentials.email == null || credentials.password == null || credentials.username == null){
        console.log("Please fill in correct email or password");
        return "Please fill in correct email or password";
      }
      const email = credentials.email;
      const pass = credentials.password;
      const vertifypass = credentials.vertify;
      const username = credentials.username.value;
      console.log(vertifypass);
      if(pass != vertifypass){
        console.log(pass+":"+vertifypass);
        console.log("Passwords does not match")
        return "Passwords does not match";
      } else{
        console.log(pass+":"+vertifypass);
      }
      AuthService.register(credentials).then(function (user){
       // $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
       // $scope.setCurrentUser(user);
        console.log("register success");
      }, function(){
        //console.log("LOGIN FAILED");
        //$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
      
     
      //Add username to userlist. 
    }

  };

});

app.controller('main-controller', function($scope, $ionicSideMenuDelegate, $firebaseObject){
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  var rootRef = new Firebase('https://bearly-7cb64.firebaseio.com/users');
  var lisaref = rootRef.child('lisa');
  this.user = $firebaseObject(lisaref);
//https://www.youtube.com/watch?v=XDuL3yYMC44
//https://www.firebase.com/docs/web/libraries/ionic/guide.html  
});

