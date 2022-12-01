import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB2o7I7L8rhcFfMLddRFvgE8RKZLIJz10w",
  authDomain: "anime-stream-7be62.firebaseapp.com",
  projectId: "anime-stream-7be62",
  storageBucket: "anime-stream-7be62.appspot.com",
  messagingSenderId: "753093486782",
  appId: "1:753093486782:web:b26a683d596d8fdefb16ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log('Firebase initialized')