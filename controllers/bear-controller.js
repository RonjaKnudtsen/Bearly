angular.module('bearly.controllers').controller('bear-controller', function($scope, $stateParams, $state, $firebaseObject, ReviewService, DrinkService, UserHistory){
	$scope.review = ReviewService.getReview($state.params.bearId);
	//$scope.drink = DrinkService.getDrink($scope.review.drinkId);
	console.log(UserHistory);
});