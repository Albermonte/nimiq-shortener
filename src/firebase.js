//https://www.youtube.com/watch?v=831zOI02Q_0
import {initializeApp} from 'firebase';

const app = initializeApp({
  apiKey: "AIzaSyC354qBB4o-FK5spI73fBj794O_So9PetE",
  authDomain: "shortnim-eba7a.firebaseapp.com",
  databaseURL: "https://shortnim-eba7a.firebaseio.com",
  projectId: "shortnim-eba7a",
  storageBucket: "shortnim-eba7a.appspot.com",
  messagingSenderId: "1018896212159"
})

export const db= app.database()

export const namesRef = db.ref('shorted')