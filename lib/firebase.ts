import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDZ37oMBwxicDRagXN4fsriv97Nus9Ea40",
    authDomain: "studio-7139029263-9f34e.firebaseapp.com",
    projectId: "studio-7139029263-9f34e",
    storageBucket: "studio-7139029263-9f34e.firebasestorage.app",
    messagingSenderId: "810306298840",
    appId: "1:810306298840:web:0bc49de090b5a00c6948ad"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };
