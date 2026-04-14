import { auth, db } from './env.js';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";


const provider = new GoogleAuthProvider();

function showMessage(message, divID) {
    var messageDiv = document.getElementById(divID);
    if (!messageDiv) return;

    messageDiv.style.display = "block";
    messageDiv.style.opacity = "1"; 
    messageDiv.innerHTML = message;

    setTimeout(function () {
        messageDiv.style.opacity = "0";
    }, 5000);
}

// Google Login
const googleLogin = document.getElementById('Google-signin');
if (googleLogin) {
    googleLogin.addEventListener("click", function() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error during Google sign-in:", errorMessage);
            });
    });
} else {
    console.log("Google-signin button not found on this page.");
}

// Sign Up
const signUp = document.getElementById('submitSignUp'); 
if (signUp) {
    signUp.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('email-js').value;
        const password = document.getElementById('password-js').value;
        const name = document.getElementById('name-js').value;

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters!', 'signUpMessage');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
              email: email,
              name: name,
            };

            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData) // Add user data to Firestore
              .then(() => {
                showMessage('Account created successfully', 'signUpMessage');
              })
              .catch(() => {
                showMessage('Error storing user data!', 'signUpMessage');
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email already exists!', 'signUpMessage');
            } else {
                showMessage('Unable to create user :/', 'signUpMessage');
            }
          });
    });
}

// Sign In
const signIn = document.getElementById('submitSignIn'); 
if (signIn) {
    signIn.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('semail-js').value;
        const password = document.getElementById('spassword-js').value;

        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
            showMessage('Login Successful', 'signInMessage');
            localStorage.setItem('LoggedInUserId', userCredential.user.uid);
            window.location.href = 'dashboard.html';
          })
          .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/wrong-password') {
                console.log("Error signing in:", error.message);
                showMessage('Incorrect email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist', 'signInMessage');
            }
          });
    });
}
