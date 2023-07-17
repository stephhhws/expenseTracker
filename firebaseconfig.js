import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7n-W0EJSIejQOz70_a0Gaw6PBmnsVYj4",
  authDomain: "tracker-855e5.firebaseapp.com",
  projectId: "tracker-855e5",
  storageBucket: "tracker-855e5.appspot.com",
  messagingSenderId: "250318616101",
  appId: "1:250318616101:web:2af6712d64bdaeb69d71cc"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export { FIRESTORE_DB, FIREBASE_AUTH };
