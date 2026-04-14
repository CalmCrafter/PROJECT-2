import { auth, db } from './env.js';
import { onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const userTableBody = document.getElementById('userTableBody');
const adminStatus = document.getElementById('adminStatus');

function showStatus(message, isError = false) {
    adminStatus.textContent = message;
    adminStatus.style.display = 'block';
    adminStatus.style.backgroundColor = isError ? '#ffe3e3' : '#e3ffe3';
    adminStatus.style.color = isError ? '#d32f2f' : '#2e7d32';
    setTimeout(() => {
        adminStatus.style.display = 'none';
    }, 5000);
}

async function checkAdminStatus(user) {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists() && docSnap.data().role === 'admin') {
            loadUsers();
        } else {
            alert('Access Denied: Admin privileges required.');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
        window.location.href = 'dashboard.html';
    }
}

async function loadUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        userTableBody.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${data.name || 'N/A'}</td>
                <td>${data.email || 'N/A'}</td>
                <td>${(data.skills || []).join(', ') || 'None'}</td>
                <td>
                    <button class="action-btn reset-btn" data-email="${data.email}">Trigger Reset</button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });

        // Add event listeners to reset buttons
        document.querySelectorAll('.reset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const email = e.target.getAttribute('data-email');
                if (email && email !== 'N/A') {
                    handlePasswordReset(email);
                }
            });
        });
    } catch (error) {
        console.error("Error loading users:", error);
        userTableBody.innerHTML = '<tr><td colspan="4">Error loading users.</td></tr>';
    }
}

function handlePasswordReset(email) {
    if (confirm(`Send password reset email to ${email}?`)) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                showStatus(`Password reset email sent to ${email}`);
            })
            .catch((error) => {
                console.error("Error sending reset email:", error);
                showStatus(`Failed to send reset email: ${error.message}`, true);
            });
    }
}

onAuthStateChanged(auth, (user) => {
    checkAdminStatus(user);
});
