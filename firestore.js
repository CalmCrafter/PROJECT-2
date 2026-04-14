import { auth, db } from './env.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            console.log('No user signed in. Redirecting to login...');
            window.location.href = 'login.html';
        }
    });

    const saveProfileButton = document.getElementById('saveProfileButton');
    if (saveProfileButton) {
        saveProfileButton.addEventListener('click', async () => {
            const user = auth.currentUser;
            if (user) {
                const name = document.getElementById('name')?.value || '';
                const bio = document.getElementById('bio')?.value || '';
                const experienceLevel = document.getElementById('experience')?.value || '';
                const github = document.getElementById('github')?.value || '';

                const skills = [];
                document.querySelectorAll('.skills-container input[type="checkbox"]:checked').forEach(checkbox => {
                    skills.push(checkbox.value);
                });

                const otherSkills = document.querySelectorAll('.skills-container input[type="text"]');
                otherSkills.forEach(input => {
                    if (input.style.display !== 'none' && input.value) {
                        skills.push(input.value);
                    }
                });

                const profileData = {
                    name: name,
                    bio: bio,
                    experienceLevel: experienceLevel,
                    skills: skills,
                    github: github,
                    updatedAt: serverTimestamp(),
                };

                try {
                    console.log('db:', db);
                    console.log('user.uid:', user.uid);

                    
                    const userRef = doc(db, 'users', user.uid);

                   
                    await setDoc(userRef, profileData, { merge: true });
                    console.log('Profile saved successfully!');
                    alert('Profile saved successfully!');
                } catch (error) {
                    console.error('Error saving profile:', error);
                    alert('Failed to save profile. Please try again.');
                }
            }
        });
    } else {
        console.error('Save Profile Button not found!');
    }
});
