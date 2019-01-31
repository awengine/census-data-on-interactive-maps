const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors")({ origin: true });
const bodyParser = require("body-parser");
const app = express();

// The Firebase Admin SDK to access the Firebase Realtime Database.
// Credentials are stored locally automatically to ensure security.
const admin = require("firebase-admin");
admin.initializeApp();

// Add CORS (cross-origin resource sharing) capabilities, which allows resources be accessed from other domain.
// Only with correct CORS headers, frontend and backend can communicate, both in dev and production.
// Otherwise, modern browers would block the interaction.
app.use(cors);
// Add Body parser, which parse the request body into an object with specified format. Here is JSON.
app.use(bodyParser.json());

// This function would allow the user to retrieve the data from the DB for census
// If user query /getCensusData using get method, handle here
app.get("/getCensusData", (request, response) => {
    // Load data once and use its snapshot to send response.
    admin
        .database()
        .ref("/census")
        .once("value")
        .then(snapshot => {
            response.send(snapshot);
        });
});

// This function is to save the user details
app.post("/createUser", (request, response) => {
    const user = request.body;
    // Create /users/userid as new user document based on request body (JSON).
    // .set() is to save data
    admin
        .database()
        .ref("/users")
        .child(user.uid)
        .set(user)
        .then(() => {
            // In ExpressJS, always need to send back some data as response.
            response.send(user);
        });
});

// For firebase functions, whenever there's https event and it's a request, let the Express app to handle it.
// /api/ comes from this index.js is exported as "api" as above.
exports.api = functions.https.onRequest(app);
