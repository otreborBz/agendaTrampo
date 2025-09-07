// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyBs_XVPMj-m4TAJITCO4Y_rdvAhbYitoNU",
  authDomain: "agendatrampo.firebaseapp.com",
  projectId: "agendatrampo",
  storageBucket: "agendatrampo.firebasestorage.app",
  messagingSenderId: "114985821719",
  appId: "1:114985821719:web:5542423a6e5ddea19b1e52",
  measurementId: "G-MJ1SQL357L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence( AsyncStorage )
});
export { db, auth };