import { auth, db } from './env.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import { doc, setDoc, getDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'login.html';
        } else {
            // Load existing profile data
            try {
                const userRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userRef);
                
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    
                    // Populate form fields with existing data
                    document.getElementById('name').value = userData.name || '';
                    document.getElementById('bio').value = userData.bio || '';
                    document.getElementById('experience').value = userData.experienceLevel || 'Beginner';
                    document.getElementById('github').value = userData.github || '';
                    
                    // Handle skills checkboxes
                    if (userData.skills && Array.isArray(userData.skills)) {
                        userData.skills.forEach(skill => {
                            // Try to find a checkbox with this skill value
                            const checkbox = document.querySelector(`input[type="checkbox"][value="${skill}"]`);
                            if (checkbox) {
                                checkbox.checked = true;
                            } else {
                                // Check if it might be an "other" skill
                                const categories = ['frontend', 'backend', 'devops', 'sports', 'arts', 'other'];
                                for (const category of categories) {
                                    const otherCheckbox = document.querySelector(`input[type="checkbox"].other-skill-checkbox[data-target="other-skill-${category}"]`);
                                    const otherInput = document.getElementById(`other-skill-${category}`);
                                    
                                    if (otherInput && !otherInput.value) {
                                        otherCheckbox.checked = true;
                                        otherInput.style.display = 'block';
                                        otherInput.value = skill;
                                        break;
                                    }
                                }
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
            }
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
                    const userRef = doc(db, 'users', user.uid);
                    await setDoc(userRef, profileData, { merge: true });
                    alert('Profile saved successfully!');
                } catch (error) {
                    alert('Failed to save profile. Please try again.');
                }
            }
        });
    }
});
