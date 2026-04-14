// Import Firebase modules
import { auth, db } from "./env.js"; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.getElementById('submit-project').addEventListener('click', async (e) => {
  e.preventDefault();

  const projectName = document.getElementById('project-name').value;
  const projectDescription = document.getElementById('project-description').value;
  const projectSkills = document.getElementById('project-skills').value.split(',');
  const active = document.getElementById('active').checked;

  console.log("submit project data being called");

  try {
    await addDoc(collection(db, "Project"), {
      name: projectName,
      description: projectDescription,
      skills: projectSkills,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: active,
      ownerId : auth.currentUser.uid,
      collabRequests: [],
    });
    alert("Project added successfully!");
  } catch (error) {
    console.error("Error adding project:", error);
  }
});
