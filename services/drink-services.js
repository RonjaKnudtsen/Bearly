var app = angular.module('bearly.services');
app.constant('firebaseURL', 'https://bearly-7cb64.firebaseio.com' );
app.constant('firebaseApiKey', 'AIzaSyBI4Fkt4EXTgNwMnrXrMyPbwdALB8VolMY' );
app.constant('firebaseAuthDomain', 'bearly-7cb64.firebaseapp.com' );
app.constant('storageBucket', 'gs://bearly-7cb64.appspot.com');

//app.service('rootRef', ['firebaseURL', Firebase]);

//http://ourcodeworld.com/articles/read/150/how-to-create-an-image-file-from-a-base64-string-on-the-device-with-cordova
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
function saveAsImageFile(blob){
	console.log("Writing file");
	var folderpath = cordova.file.externalRootDirectory;
	var filename = "test.jpeg";

	$ionicPlatform.ready(function() {
		$cordovaFile.writeFile(folderpath, filename, blob, true)
		.then(function(object){
			console.log(object);
		},function(error){
			console.log(error);
		});
	});
}

app.factory('ReviewService', function($firebaseObject, $firebaseArray, Firebase, AuthService, ProfileService){
	var factory = {};
	//var database = new Firebase('https://bearly-7cb64.firebaseio.com');
	var rootref = Firebase.rootRef;
	var reviewRootRef = Firebase.rootRef.child('review');
	var storage = Firebase.storage;




	factory.getReviews = function(){
		return $firebaseArray(reviewRootRef);
	}
	factory.getReview = function(id){
		return $firebaseObject(reviewRootRef.child(id));
	}
	factory.postReview = function(review){




		var user = AuthService.getCurrentUser(); //Get current user. 
		var assessmentData = {
			look: review.lookRating,
			price: review.priceRating,
			taste: review.tasteRating,
		}

		var reviewData = {
			name : review.drink,
			comment: review.description,			
			drinkId: review.drinkId,
			timestamp: review.time,
			assessment: assessmentData,
			author: user.uid,
		}

		
		var drinkId = review.drinkId;
		var reviewId = rootref.child('review').push().key;
		var reviewRef = reviewRootRef.child(reviewId);

		// ! FORMAT THE RETURNED REVIEW ITEM SO IT IS CORRESPONDING TO DATABASE INCLUDING TIMESTAMP. 
		
		var updates = {};
		updates['/review/' + reviewId] = reviewData;
		//updates['/review/' + reviewId + '/authors/' + user.uid ] = true;
		//ProfileService.postReviewId(reviewId); //Many to many relation.

		//MIGHT NEED TO GET REVIEWID EARLIER. If no drink exist, create it. 
		updates['/drinks/'+ reviewId.drinkId + '/reviews/' + drinkId ] = true;

		return rootref.update(updates).then(function(res){
			//Add post id to user.
			ProfileService.postReviewId(reviewId);
			console.log(review.imageData);

			var blob = b64toBlob(review.imageData, "image/jpeg", 512);
			var file = saveAsImageFile(blob);

			var storageRef = storage.ref('img/'+reviewId+'.JPEG');

			var task = storageRef.putString(review.imageData, 'image');
			task.on('state_changed',
				function progress(snapshot){
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
					uploader.value = percentage;

				},function error(err){
					console.log(err);
				}, function complete(){
					console.log("Congratz, you uploaded a pic");
				}
			);
			//Generate image
			/*var uploadImage = storageRef.child(user.uid'/images/reviews/').putString(review.imgURI, review.imageMetadata);
			uploadImage.then(function(snapshot){
				console.log('Uploaded image');
			});*/




			console.log("happy happy")
			return(reviewId);
		}, function(error){
			console.log("Something happened when creating or updating review");
			console.log(error);
			return(error);
		});	
		
	}
	factory.updateReview = function(review){
		//Extract some functionality from post review. 
	}

	return factory;
});
	
app.factory('DrinkService', function($firebaseObject, $firebaseArray, Firebase){
	var factory = {};
	var drinkRef = Firebase.rootRef.child('drinks');
	factory.getDrinks = function(){
		return $firebaseArray(drinkRef);
	}
	factory.getDrink = function(id){
			return $firebaseObject(drinkRef.child(id));
	}

	factory.postReview = function(review){

	}
	factory.updateReview = function(review){

	}

	return factory;
});
	
