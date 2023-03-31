import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBCSLpY4G7IBYdFBpg-71uAVR52OzwJCNw",
  authDomain: "bookshelf-ef0a5.firebaseapp.com",
  projectId: "bookshelf-ef0a5",
  storageBucket: "bookshelf-ef0a5.appspot.com",
  messagingSenderId: "695152389167",
  appId: "1:695152389167:web:19714d7f56beb344412ada"
};


const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);