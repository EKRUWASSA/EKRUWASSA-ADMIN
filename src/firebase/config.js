// Import the functions you need from the SDKs you need

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_K17PkVzYRdF0hGazuBGM303aggFae2g",
  authDomain: "mipu-9f72e.firebaseapp.com",
  projectId: "mipu-9f72e",
  storageBucket: "mipu-9f72e.appspot.com",
  messagingSenderId: "725415495634",
  appId: "1:725415495634:web:2dab347a297b2939cc2a0b",
  measurementId: "G-2RZGM0GQBX"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const projectAuth = firebase.auth(app);
const projectFirestore = firebase.firestore(app);
const projectStorage = firebase.storage(app);
const timestamp = (date) => {
  return firebase.firestore.Timestamp.fromDate(date);
};
export { projectAuth, projectFirestore, projectStorage, timestamp };
