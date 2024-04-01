import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD6ifkpX2r0uJNfTkggXesK1uR6EtdcQY0",
    authDomain: "meeting-scheduler-2024.firebaseapp.com",
    projectId: "meeting-scheduler-2024",
    storageBucket: "meeting-scheduler-2024.appspot.com",
    messagingSenderId: "169049871228",
    appId: "1:169049871228:web:036733da79586ebeea0af9"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };