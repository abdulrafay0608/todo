import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, doc, getDocs } from "firebase/firestore";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const firebaseConfig = {
    apiKey: "AIzaSyABIViWmQ0rUQ33zQNwYATD_XTgL1s9rcc",
    authDomain: "website-firebase-680cd.firebaseapp.com",
    databaseURL: "https://website-firebase-680cd-default-rtdb.firebaseio.com",
    projectId: "website-firebase-680cd",
    storageBucket: "website-firebase-680cd.appspot.com",
    messagingSenderId: "881351921814",
    appId: "1:881351921814:web:3679c08c0d623145e7f2b7",
    measurementId: "G-CHY738C4E7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
