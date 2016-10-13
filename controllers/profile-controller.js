angular.module('bearly.controllers').controller('profile-controller', function($scope, $state, AuthService, ProfileService){
	//var user = AuthService.getCurrentUser();
	$scope.profile = ProfileService.getCurrentProfile();
//$scope.profile = ProfileService.getProfile(AuthService.getCurrentUser());
	/*const user = AuthService.getCurrentUser();
	const.then(function(res){
			console.log(res);
		});


	const promise = Firebase.auth.signOut();
    promise.then(function (res){
      console.log("signing out");
    })
    .catch(e=> console.log(e.message));
    return promise;



	AuthService.getCurrentUser(function(user){
		//console.log(user);
		/*$scope.profile = ProfileService.getProfile(user.uid);
		$scope.profile.then(function(res){
			console.log(res);
		});
		var promise = ProfileService.getProfile(AuthService.getCurrentUser());
		promise.then(function(res){
			console.log(res);
		})
	})*/
});