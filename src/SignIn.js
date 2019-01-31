import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import "./App.css?raw";
import axios from "axios";
import authFile from "../auth.json";

// Configure Firebase.
const config = {
    apiKey: authFile.FirebaseApiKey,
    authDomain: authFile.FirebaseDomain,
};
firebase.initializeApp(config);

export default class SignIn extends React.Component {
    state = {
        signin: false
    };
    // Configure FirebaseUI.
    uiConfig = {
        // Popup signin flow rather than redirect flow
        signInFlow: "popup",
        // Display Google as auth provider
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        // Use callback instead of redirecting to new url after signin
        callbacks: {
            signInSuccessWithAuthResult: () => false
        }
    };

    // Listen to the Firebase Auth state and set the state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
            this.setState({ signin: !!user });

            // Get the user's OAuth data from OAuth provider and send to NodeJS.
            // Send POST reqest only after login (not after logout)
            if (user) {
                const data = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified
                };
                axios
                    .post("/createUser", data)
                    // The response comes from the "response.send()" in NodeJS
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        if (!this.state.signin) {
            return (
                <div>
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                </div>
            );
        } else {
            return (
                <div className="w3-container w3-blue w3-center">
                    <a>Welcome {firebase.auth().currentUser.displayName}! </a>
                    <a className="w3-button" onClick={() => firebase.auth().signOut()}>
                        Signout
                    </a>
                </div>
            );
        }
    }
}
