// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// Production-ready: Reads from Vite environment variables with graceful fallback
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBJzL0doYOBQp7xKz4Jh_TnzjtWwCkJbjA",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mern-estate-9c48c.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mern-estate-9c48c",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mern-estate-9c48c.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "300028713376",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:300028713376:web:d89a30941e7d4aebefacc5",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EVS89ZCZ9J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);