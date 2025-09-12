// src/services/firestoreService.js
import { db } from './firebaseConnection';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';


