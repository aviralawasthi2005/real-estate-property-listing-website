// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBJzL0doYOBQp7xKz4Jh_TnzjtWwCkJbjA",
    authDomain: "mern-estate-9c48c.firebaseapp.com",
    projectId: "mern-estate-9c48c",
    storageBucket: "mern-estate-9c48c.firebasestorage.app",
    messagingSenderId: "300028713376",
    appId: "1:300028713376:web:d89a30941e7d4aebefacc5",
    measurementId: "G-EVS89ZCZ9J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);