
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBSCJwX9e92JFyRWlOkMxCfyJfE15oSgJU",
  authDomain: "skillsync-67adc.firebaseapp.com",
  projectId: "skillsync-67adc",
  storageBucket: "skillsync-67adc.firebasestorage.app",
  messagingSenderId: "646697456816",
  appId: "1:646697456816:web:c09c78851964844a085775",
  measurementId: "G-H7TNCMZPJ0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
