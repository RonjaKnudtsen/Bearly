# Bearly (Work in progress)
Student project. Bear puns and beer. Frameworks: ionic, cordova, angular. Backend: Firebase.    
Created with the ionic framework.   

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
  
If you have any problems with building for android it might work if you uninstall the android 24 sdk (from android studio), and only use android 23 sdk.
  
###### The firebase_api_keys.js should contain:  
```
//connects the constants to the services module.  
var app = angular.module('bearly.services');  
app.constant('firebaseURL', yourfirebaseurl' );  
app.constant('firebaseApiKey', ' yourfirebaseapikey' );  
app.constant('firebaseAuthDomain', ' yourfirebaseauthdomain');  
app.constant('storageBucket', ' yourstoragebucket');  
```

# Priority fixes
###### Services:
1. Firebase upload. Camera pictures will not upload to firebase.
2. When a new user is logged in, the "My profile" is not updated.
3. Make it possible to create a new drink which is not in the database. This drink should be marked as unfinished until it has been validated and added metadata.
4. Move the services and factories out of app.js (clean up the code)

###### Database/metadata:
1. Add more drinks to the database.
2. Map out if more metadata should be added or removed.



