import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



// Chaves de contingência/hardcoded (se necessário rodar local sem .env):
// const firebaseConfigBackup = {
//   apiKey: "AIzaSyCuXBQ8beGiPstkgYREAKrFtr3eoF6OUXE",
//   authDomain: "drivez-chat.firebaseapp.com",
//   projectId: "drivez-chat",
//   storageBucket: "drivez-chat.firebasestorage.app",
//   messagingSenderId: "381682333746",
//   appId: "1:381682333746:web:2376d3d31d699a4c57e42b",
//   measurementId: "G-4SSYM80KK5"
// };