// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('bearly.controllers', []); //Create a module with controllers, send this controller to the app.
//To use the controller: angular.module('bearly.controllers').controller('new-controller-name', function($scope...){...})
angular.module('bearly.services', []);

angular.module('bearly.directive', ['bearly.services']);

var app = angular.module('starter', ['ionic', 'firebase', 'ngCordova', 'bearly.controllers', 'bearly.services', 'bearly.directive' ]);
/*Listening to the $routeChangeStart (for ngRoute) or $stateChangeStart (for UI Router) event
When a user is not authorized to access the page (because he’s not logged in or doesn’t have the right role), the transition to the next page will be prevented, so the user will stay on the current page. */
app.run(function($ionicPlatform, $rootScope, AuthService, $state, Firebase, Popup, UserHistory) {
  var appstart = true;

  //ON state change executes each time we notice a statechange. This often executes before statechangeerror.
  //If the user already is on the loginpage we only need to ask them to login. 
  //If the user is suddenly logged out we can promt them only for password, if the email is still saved in the UserHistory.
  //Later: save userhistory to localstorage. Maybe even logged in sessions. 
  var onStateChange = function(){
    Firebase.auth.onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log("LOGGED IN: " + firebaseUser.email);
        $state.go('bears');
      } else {
        console.log("not logged in");
        if(appstart){
          //Just started the app, dont prompt error popup, just redirect to login page. 
          $state.go('login');
          appstart = false; //App have now been started
        } else if(!$state.is('login')){
          console.log("state go login");
          if(UserHistory.email){
            Popup.password(UserHistory.email);
          } else{
            Popup.alertPopup("<center> Please log in again</center>", "Bearly sorry");
            $state.go('login');
          }                     
        }      
        
      }
    });
  };
  
  onStateChange();

  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, rejection) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    console.log("STATE CHANGE ERROR");
    console.log(rejection);
    event.preventDefault();
    if (rejection === "NOT_AUTHORIZED") {
      
      //onStateChange();
      //MOST LIKELY THE ON STATE CHANGE CHECK ABOVE IS ENOUGH? 
      if($state.is('login')){
        console.log("state is login");
          Popup.alertPopup("<center> Please log in</center>", "Bearly sorry");
      } else{
        if(UserHistory.email){
            Popup.password(UserHistory.email);
          } else{
            if(!appstart){
            Popup.alertPopup("<center> Please log in again</center>", "Bearly sorry");
            appstart = false;
            }
            $state.go('login');
          }       
      }     
      console.log("REJECTION");
     
    }
  });
  
  $ionicPlatform.ready(function() {

    //IONIC STANDARD CODE: 
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

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('login',{
    url: "/login",
    templateUrl: "templates/login.html",
  })
  .state('logout',{
    url: "/logout",
    templateUrl: "templates/logout.html",
  })
  .state('bears',{
    url: "/bears",
    templateUrl: "templates/bears.html",
    controller: "bears-controller",
    resolve: {
      userAuthenticated : ["AuthService", function(AuthService){
       return AuthService.resolve();
     }]
    }
  })
  .state('new',{
    url: "/new",
    templateUrl: "templates/new-bear.html",
    controller: "new-bear-controller",
    resolve: {
      userAuthenticated : ["AuthService", function(AuthService){
       return AuthService.resolve();
     }]
    }
  })
  .state('bear',{
    url: "/bear/:bearId", //Can now use $stateParams in controller. to get {bearId}
    templateUrl: "templates/bear.html",
    controller: "bear-controller",
    resolve: {
      userAuthenticated : ["AuthService", function(AuthService){
       return AuthService.resolve();
     }]
    }
  })
  .state('bear.edit',{
    url: "/bear/:bearId/edit", //Can now use $stateParams in controller. to get {bearId}
    templateUrl: "templates/bear-edit.html",
    controller: "bear-edit-controller", 
  })
  .state('search',{
    url: "search",
    templateUrl: "templates/search.html",
    controller: "search-controller",
    resolve: {
      userAuthenticated : ["AuthService", function(AuthService){
       return AuthService.resolve();
     }]
    }
  })
  .state('profile',{
    url: "profile",
    templateUrl: "templates/profile.html",
    controller: "profile-controller",
    resolve: {
      userAuthenticated : ["AuthService", function(AuthService){
       return AuthService.resolve();
     }]
    }
  })
  /*.state('profile.edit',{ //a user profile
    url: "/edit", //will add Edit to profile, so profile/:user/edit
    templateUrl: "templates/profile-edit.html",
    controller: "profile-edit-controller",
    resolve: {
      userAuthenticated : ["AuthService", function(AuthService){
       return AuthService.resolve();
     }]
    } 
  })*/
  $urlRouterProvider.otherwise('/bears');
});

//Global connection to the firebase server
app.service('Firebase', function(firebaseURL, firebaseApiKey, firebaseAuthDomain, storageBucket){
  var app = {}
  var config = {
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    databaseURL: firebaseURL,
    storageBucket: storageBucket,
    //storageBucket: "gs://bearly-7cb64.appspot.com",
    };
  firebase.initializeApp(config);
  app.database = firebase.database();
  app.rootRef = firebase.database().ref();
  app.storage= firebase.storage();
  app.auth = firebase.auth();
  //I en controller eller resolve kan auth.signInWithEmailAndPassword(email, pass); brukes
  
  return app;
});
//Will output error message to the user.
app.directive('errorMessage', function(message){
  return {
    template: 'Error: {{message}}'
  };
});

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth){
      return $firebaseAuth();
    }
  ]);
//So we only need to promt password. 
app.constant('UserHistory', {
  email: '',
  username: '',
  uid: '',
  loggedIn: 'false',
});
//3 functions: 1. login, 1.5 reister, 2 check if authenticated, 3: check if authorized
app.factory('AuthService', function (Firebase, $q, Popup, UserHistory, $state){
  var authService = {};

  authService.resolve = function(){
    var deferred = $q.defer();
    if(Firebase.auth.currentUser){
      deferred.resolve(Firebase.auth.currentUser);
    } else{
    console.log("AUTHSERVICE NOT AUTHORIZED");

    deferred.reject('NOT_AUTHORIZED');
    } return deferred.promise;
  }
  //Kan være litt overflødig, men brukes til å sjekke om vi skal vise login knappen. Kunne kanskje brukt resollve eller noe. 
  authService.isLoggedIn = function(){
    if(Firebase.auth.currentUser){
      console.log(Firebase.auth.currentUser);
      console.log("Is logged in");
      return true;
    } else{
      console.log("Is not logged in");
      return false;
    } 
  }

  authService.logout = function(){
    const promise = Firebase.auth.signOut();
    promise.then(function (res){
      console.log("signing out");
    })
    .catch(e=> console.log(e.message));
    return promise;
  };
  authService.login = function(credentials){
    const promise = Firebase.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
    promise.then(function (res){
      //returns userid provider, token 
      UserHistory.email = credentials.email;
      UserHistory.uid = credentials.uid;


      return res.uid;
      //Kan også lage en real time authentication listener fra firebase 
      // https://youtu.be/-OKrloDzGpU?t=542 
    })
    .catch(e=> console.log(e.message));
    return promise;
  };
  authService.register = function(credentials){
    console.log("credentials:"+credentials);
    const promise = Firebase.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    promise.catch(e=> console.log(e.message));
    return promise;
  };
  authService.getCurrentUser = function(){
    return firebase.auth().currentUser;
    /*firebase.auth().onAuthStateChanged(function(user) {
      if (user) {        
        return user;
      } else {
        console.log("Cant get current user");
        return null;
      }
    });*/
    
  };
  return authService;
});
//Alerts and other popup messages
//Can only be used from a controller where we have a scope. 
app.service('Popup', function($ionicPopup){
  var popUp = {};
    popUp.loginPopup = function($scope){
      if(!$scope){console.log("Can only be used from a controller where we have a scope.")};
      var loginPopup = $ionicPopup.show({
      templateUrl: "templates/simple-login-form.html",
      title: "Please log in",
      subTitle: "Something happened",
      scope: $scope,
      buttons: [
        { text: 'Cancel', 
          type: 'button-assertive'
        }, 
        { text: '<b>Login</b>', 
          type: 'button-positive', 
          onTap: function(e){
            console.log($scope.credentials);
            if(!$scope.credentials.email){
              e.preventDefault();
            } else {              
              AuthService.login($scope.credentials);
              return $scope.data.wifi;
            }
          }          
        }
      ]
    });

    loginPopup.then(function(res){
      console.log(res);
    });
  };
  popUp.alertPopup = function(title, message){
    var alertPopup = $ionicPopup.alert({
      title: message,
      template: title
    });
    alertPopup.then(function(res){
      console.log(message);
    });
  }
  //If we know the username/email we can prompt only for password. 
  popUp.password = function(email){
    console.log(email);
    //need email to login with only password.
    if(email){
      var passwordPrompt = $ionicPopup.prompt({
        title: "Please re-enter your password",
        template: email,
        inputType: "password",
        inputPlaceholder: "Your password"
      }).then(function(res){
        console.log('your password is', res);
        //AuthService.login(email, res) 
      })
    } 
  };
  return popUp;
});


app.controller('Bearly-Controller', function($scope, AuthService, $state){
  //Should maybe move this to a service. 

  //Fix menu close button.
  $scope.showMenu = function () {
  $ionicSideMenuDelegate.toggleLeft();
  }
  //initialize currentuser, userroles and isauthorized.
  $scope.currentUser = null;
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
});

/*
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
});*/


//Login controller for the login page. 
app.controller('login-controller', function($scope, $rootScope, AuthService, ProfileService, Popup){
  $scope.currentUser = null;

  $scope.setCurrentUser = function(user){
    $scope.currentUser = user;
  };
  $scope.isLoggedIn = AuthService.isLoggedIn();

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
        $scope.setCurrentUser(user);
        console.log("LOGIN SUCCESS");
      }, function(err){
        Popup.alertPopup("<center>" + err + "</center>", "Bearly sorry");
        console.log("LOGIN FAILED");
      });
    }
  };
  $scope.logout = function(){
    AuthService.logout().then(function(){
        //redirect?
        console.log("logout SUCCESS");
      }, function(){
        console.log("logout FAILED");
      });
  }
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
      const username = credentials.username;
      //const profilepicture = credentials.profilepicture;
      const profilepicture = "img.jpg";
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
        $scope.setCurrentUser(user);
        console.log("register success");
        console.log(user);
        //Register profile settings
        ProfileService.register(credentials, user.uid).then(function(user){
            ProfileService.getCurrentProfile();
        }, function(err){
          console.log("Profile registration failed.");
          console.log(err);
          Popup.alertPopup("<center>Profile registration " + err + "</center>", "Bearly sorry");
        });
      }, function(err){
          console.log("Register failed.");
          console.log(err);
          Popup.alertPopup("<center>User registration " + err + "</center>", "Bearly sorry");
        //$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
      
     
      //Add username to userlist. 
    }

  };

});
//http://www.angulartutorial.net/2014/03/rating-stars-in-angular-js-using.html THANKS!

app.factory('ProfileService', function (Firebase, UserHistory, $state, $firebaseObject, AuthService){
  var profileService = {};
  var profileRef = Firebase.rootRef.child('profile');

  //No passwords saved in profile. They are handled by firebase.
  
  profileService.register = function(profile, uid){
    var profileData = {
      //profilepicture: profile.profilepicture,
      username: profile.username,
      email: profile.email,
      uid: uid,
      nrOfReviews: 0,
      averageScore: 0, //if we find 0, then overwrite it.
    }
    return profileRef.child(uid).set(profileData);

  };
  profileService.getProfile = function(uid){
    console.log(uid);
    return $firebaseObject(profileRef.child(uid));
  }
  profileService.getCurrentProfile = function(){
    var user = AuthService.getCurrentUser(); 
    //MIGHT BE THAT WE NEED TO WAIT FOR AUTHSERVICE FIRST WITH PROMISE OR SOMETHING..
     return $firebaseObject(profileRef.child(user.uid));
  }
  profileService.postReviewId = function(reviewId){
    var user = AuthService.getCurrentUser(); 
    return profileRef.child(user.uid).child('reviews').child(reviewId).set(true);
  }
  return profileService;
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

