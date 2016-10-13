var app = angular.module('bearly.directive');
app.factory('ratingTemplates', function(){
	return{
		vertical: 'directive/template/rating-ver.html',
		horizontal: 'directive/template/rating-hor.html'
	}
})
app.directive('starRating', function(ratingTemplates){
	return{
		restrict: 'E',
		templateUrl: function($elem, $attr){
			return ratingTemplates[$attr.layout]; //$attr.layout
			//http://stackoverflow.com/questions/19015239/angular-directive-with-multiple-templates
		},
		scope: {
			type: '=',
			ratingValue: '=value',		
			readOnly : '=',	
		},
		controller: function($scope){
			//Initialize with 6 empty stars.
			$scope.stars = [];
			$scope.max = 6;	

			 //Initialize. 
			 // Checks if not empty because this can be loaded to display complete ratings. 
			for(var i = 0; i<$scope.max; i++){
				if(i<$scope.ratingValue){
					$scope.stars.push({
						class: "star_full",
						value: 1
					});
				} else{
					$scope.stars.push({
						class: "star_empty",
						value: 0
					});
				}
			}
		},
		link: function(scope, element, attrs){
			

			//rate = ng-Click event
			function updateStars(){
				for(var i = 0; i<scope.max; i++){
					if(i<scope.ratingValue){						
						scope.stars[i].class="star_full";
						scope.stars[i].value=1;
					} else{												
						scope.stars[i].class="star_empty"
						scope.stars[i].value=0;
					}
				}
			}
			
			scope.rate = function(index){
				//Can only update if not readOnly.
				//console.log(scope.readOnly);
				console.log(scope.readOnly);
				//If not defined it will be readOnly. set read-only="false" as attribute in the view.
				if(!scope.readOnly){
					scope.ratingValue = index +1;
				}else{
					console.log("failes, read only");
				}
			}
			
			scope.$watch('ratingValue', function(newValue){				
				if(newValue){
					updateStars();
				}
			})						
		},
	}
});