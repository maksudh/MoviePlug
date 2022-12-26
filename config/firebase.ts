// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMioN6rBJCuCI6YoF43BKBUYmjwR_F9pw",
  authDomain: "movieplug-99cc9.firebaseapp.com",
  databaseURL: "https://movieplug-99cc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movieplug-99cc9",
  storageBucket: "movieplug-99cc9.appspot.com",
  messagingSenderId: "674448041073",
  appId: "1:674448041073:web:eca0a46520ed157c23a7d0",
  measurementId: "G-HN6J4GZH3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
