/* Trying to make a general template 

author = null eller en spesifik forfatter.
Andre filtrerings og sorteringsmuligheter burde også være tilgjengelig. 
id = null eller EN spesifik bear. Da vil man også vise ekstra info (showAll). + kommentering. 
null gjør ng-repeat.  */

var app = angular.module('bearly.directive');
app.directive('bearReview', function(ReviewService, DrinkService){
	return{
		restrict: 'E',
		templateUrl: 'directive/template/bear-review.html',
		scope: {
			author: "=",
			id: "=",			
		},
		controller: function($scope){

			var filter = "";
			$scope.reviews = ReviewService.getReviews();
				$scope.reviews.$loaded().then(function(){
					
					$scope.drinks = DrinkService.getDrinks();	
					
					console.log($scope.reviews);		
				});
			if($scope.id){
				$scope.oneItem = $scope.id;
			} else if($scope.author){
				$scope.authorID = $scope.author;
			} else{
				
			}

			

		},
		link: function(scope, element, attrs){
			
			/*function filter(filter){
				filter(filter);
				//..
			}
			scope.$watch('filter', function(newValue){				
				if(newValue){
					reload();
				}
			})*/						
		},
	}
});