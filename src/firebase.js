// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfCOGog09vKXa_m54sWIYuhWqRA3iGFos",
  authDomain: "kalendarz-app-f4a16.firebaseapp.com",
  projectId: "kalendarz-app-f4a16",
  storageBucket: "kalendarz-app-f4a16.appspot.com",
  messagingSenderId: "34683138026",
  appId: "1:34683138026:web:9dc9fb96d1094a63628b3",
  measurementId: "G-X8RVEJJD1D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
