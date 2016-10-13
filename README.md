# Bearly
Student project. Bear puns and beer. Frameworks: ionic, cordova, angular. Backend: Firebase.    
This created with the ionic framework.   

###### Install the project:     
1. Install an empty [ionic](http://ionicframework.com/docs/guide/installation.html) project called Bearly.    
  1	sudo npm install -g cordova ([Requires Node.js](https://nodejs.org/en/))
  2 sudo npm install -g ionic
  3	ionic start Bearly blank
2. Choose wheter or not to use sass.  
3. Copy the contents of this repo into www.  
4. Set up your own [Firebase](https://www.firebase.com/) database and make a "firebase_api_keys.js" in your WWW folder.  
5. ionic serve  

###### The firebase_api_keys.js should contain:  
```
//connects the constants to the services module.  
var app = angular.module('bearly.services');  
app.constant('firebaseURL', yourfirebaseurl' );  
app.constant('firebaseApiKey', ' yourfirebaseapikey' );  
app.constant('firebaseAuthDomain', ' yourfirebaseauthdomain');  
app.constant('storageBucket', ' yourstoragebucket');  
```
