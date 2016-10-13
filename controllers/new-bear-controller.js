angular.module('bearly.controllers').controller('new-bear-controller', function($scope, $state, DrinkService, ReviewService, $cordovaCamera, $ionicPlatform){
	//Initialization
	$scope.review = {drink: ""};
	$scope.review.tasteRating = 0;
	$scope.review.lookRating = 0;
	$scope.review.priceRating = 0;
	//Get drinks from service
	$scope.drinks = DrinkService.getDrinks();
	console.log($scope.drinks);

	// Select from box (move to directive later.)
	$scope.boxHidden = true;
	$scope.select = function(drink){
		this.review.drink = drink.name;
		this.review.drinkId = drink.$id;
	}

	//Publish review.
	$scope.publish = function(){
		console.log($scope.review);
		var time = new Date().getTime();
		$scope.review.time = time;
		
		ReviewService.postReview($scope.review)
		.then(function(reviewId){
			console.log("Success");
			console.log(reviewId);
			//$scope.review = null ?
			$state.go('bear', {'bearId': reviewId});
		}, function(err){
			console.log(err);
		});
		
	}
$scope.takePicture = function(){
	console.log("take picture yes please");
	$ionicPlatform.ready(function() {
		var cameraOptions = {
		quality: 50,
		destinationType: Camera.DestinationType.DATA_URL,
		sourceType: Camera.PictureSourceType.CAMERA,
		allowEdit: false,
		encodingType: Camera.EncodingType.JPEG,
		targetWidth: 200,
		targetHeight: 250,
		popoverOptions: CameraPopoverOptions,
		saveToPhotoAlbum: false,
		correctOrientation: true
		};
		console.log("take picture");
		$cordovaCamera.getPicture(cameraOptions).then(function(imageData){
			console.log("get picture?");
			$scope.review.imgURI = "data:image/jpeg;base64,"+imageData;
			$scope.review.imageData = imageData;
			$scope.review.imageMetadata = cameraOptions;
			//http://ourcodeworld.com/articles/read/150/how-to-create-an-image-file-from-a-base64-string-on-the-device-with-cordova 
			//console.log($scope.review.imgURI);
		}, function(err){
			//error
			console.log(err);
		});

		});
	}


});