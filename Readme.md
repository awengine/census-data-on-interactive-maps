**census-data-on-interactive-maps** provides the architecture skeleton using ReactJS at the front end, backed up by Google Maps API, Firebase Auth, Realtime Database, and Functions. 

The data embeded provides a visualized interface with Australian Bureau of Statistics (ABS) census data and NASA SEDAC geographical data for identifying locations based on census parameters, such as average income and age in North Sydney.

# Functionalities
* Display a map from Google Maps API onto ReactJS frontend
* Get population density images from Cloud Storage and add them to the map
* Allow users to select different census parameters, and filter areas with the selected parameters
* Allow users to sign up using their Google account information, then automatically create a new user document in the system’s NoSQL database
* Create a RESTful API at the Node back end for different applications to consume the data

# Installation
1. [Get Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/get-api-key)

2. Google Earth Engine API

   [Get Google Earth Engine API key](https://developers.google.com/earth-engine/).

   [Select and customize preferred earth engine data](https://developers.google.com/earth-engine/datasets/catalog/CIESIN_GPWv4_population-count). Then in Earth Engine Code Editor, export data layer to cloud storage bucket.

3. ABS Census Data

   [Download census data](https://datapacks.censusdata.abs.gov.au/geopackages/) and unzip it. Select desired table and export it in CSV format. Then convert it into JSON format.


4. Setup Firebase Database and Authentication

   [Set up Firebase project in Firebase console](https://firebase.google.com/docs/web/setup).

   In Firebase Realtime Database, upload cleaned census JSON data.
   In Firebase Authentication, enable Provider: Google

5. Create Firebase local environment to interact with Firebase Cloud

   Install Firebase CLI: `npm install firebase-tools -g`

   Initialize Firebase environment: `firebase login`

   Initialize Firebase Functions: `firebase init functions`

# Run Project
1. In server/functions: `npm install`

2. In root, run the React frontend: 
`npm install`
`npm start`

3. In server folder, run Node backend locally for serverless functions: `firebase serve`

# Deployment
Deploy both React app and Node API at the same time

1. In root, use webpack to generate index_bundle.js: `npm run build`
2. Ensure all static assets and index.html are inside server/bundle
3. In server folder, `firebase deploy`

> If modify React and run build again, need to run `firebase serve` again before `firebase deploy`
