
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuXBQ8beGiPstkgYREAKrFtr3eoF6OUXE",
  authDomain: "drivez-chat.firebaseapp.com",
  projectId: "drivez-chat",
  storageBucket: "drivez-chat.firebasestorage.app",
  messagingSenderId: "381682333746",
  appId: "1:381682333746:web:2376d3d31d699a4c57e42b",
  measurementId: "G-4SSYM80KK5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// apiKey: "AIzaSyCuXBQ8beGiPstkgYREArkFtr3eoF6OUXE",
//   authDomain: "drivez-chat.firebaseapp.com",
//   projectId: "drivez-chat",
//   storageBucket: "drivez-chat.firebasestorage.app",
//   messagingSenderId: "381682333746",
//   appId: "1:381682333746:web:2376d3d31d699a4c57e42b",
//   measurementId: "G-4SSYM80KK5"