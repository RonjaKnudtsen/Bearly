# Bearly
Student project. Bear puns and beer. Frameworks: ionic, cordova, angular. Backend: Firebase.    
This created with the ionic framework.   

![alt tag](https://raw.githubusercontent.com/RonjaKnudtsen/Bearly/master/img/bearly-big.png)

###### Install the project:     
1. Install an empty [ionic](http://ionicframework.com/docs/guide/installation.html) project called Bearly.    
  a. sudo npm install -g cordova ([Requires Node.js](https://nodejs.org/en/))  
  b. sudo npm install -g ionic  
  c. ionic start Bearly blank  
2. Copy the contents of this repo into www.  
3. Set up your own [Firebase](https://www.firebase.com/) database and make a "firebase_api_keys.js" in your WWW folder.  
4. ionic serve  

###### To test with device:
1. Connect your phone with USB to your computer  
2. Turn on development mode on your phone  
3. Run "ionic build ios" or "ionic build android"  
  a. You need a mac to build for ios  
  b. You need Android Studio with SDK platform, build tools and Java JDK.  
  b2. For android: JAVA_HOME path needs to be set to your Java JDK folder.  [JAVA_HOME for Windows](https://confluence.atlassian.com/doc/setting-the-java_home-variable-in-windows-8895.html)
  b3. The Java and Android studio sdk needs to match. 
  
###### The firebase_api_keys.js should contain:  
```
//connects the constants to the services module.  
var app = angular.module('bearly.services');  
app.constant('firebaseURL', yourfirebaseurl' );  
app.constant('firebaseApiKey', ' yourfirebaseapikey' );  
app.constant('firebaseAuthDomain', ' yourfirebaseauthdomain');  
app.constant('storageBucket', ' yourstoragebucket');  
```
