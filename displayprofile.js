import { auth, db } from "./env.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getCollaborationRequests, acceptCollaborationRequest } from "./collaboration.js";


export async function updateProfileDisplay() {
    const userId = localStorage.getItem("LoggedInUserId");
    if (!userId) {
        console.log("User is not logged in.");
        return;
    }

    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById("name").textContent = userData.name || "No name available";
            const githubLink = document.getElementById("githublink");
            if (userData.github) {
                githubLink.href = userData.github;
                githubLink.textContent = userData.github;
            } else {
                githubLink.href = "#";
                githubLink.textContent = "GitHub Profile";
            }

            const skillsList = document.getElementById("skills-list");
            skillsList.innerHTML = "";
            (userData.skills || []).forEach(skill => {
                const skillElement = document.createElement("div");
                skillElement.classList.add("skill");
                skillElement.textContent = skill;
                skillsList.appendChild(skillElement);
            });

            displayProjects(userId);
        } else {
            console.log("No such user document!");
        }
    } catch (error) {
        console.error("Error getting user document:", error);
    }
}

async function displayProjects(userId) {
    try {
        const projectsList = document.getElementById("projects-list");
        projectsList.innerHTML = "";

        const projectsCollection = collection(db, "Project");
        const projectsSnapshot = await getDocs(projectsCollection);

        projectsSnapshot.forEach(docSnap => {
            const projectData = docSnap.data();

            if (projectData.ownerId === userId) {
                projectData.id = docSnap.id; 

                const projectButton = document.createElement("button");
                projectButton.textContent = projectData.name;
                projectButton.classList.add("project-button");
                projectButton.onclick = () => showProjectDetails(projectData);
                projectsList.appendChild(projectButton);
            }
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}

function showProjectDetails(project) {
    const projectDetailsDiv = document.getElementById("project-details");

    projectDetailsDiv.innerHTML = `
        <h3>${project.name}</h3>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Required Skills:</strong> ${project.skills.join(", ")}</p>
        <button class="request-collab-btn" onclick="requestCollaboration('${project.id}', '${project.ownerId}')">
            View Collaboration requests
        </button>
    `;
}
// Load incoming collaboration requests
async function loadCollabRequests() {
    const userId = localStorage.getItem("LoggedInUserId");
    const container = document.getElementById("request-container");
    container.innerHTML = "Loading...";

    if (!userId) {
        container.innerHTML = "User not logged in.";
        return;
    }

    const requests = await getCollaborationRequests(userId);
    container.innerHTML = "";

    if (requests.length === 0) {
        container.innerHTML = "<p>No collaboration requests found.</p>";
        return;
    }

    requests.forEach(async (req) => {
    try {
        // Fetch sender name
        const senderRef = doc(db, "users", req.senderId);
        const senderSnap = await getDoc(senderRef);
        const senderName = senderSnap.exists() ? senderSnap.data().name : "Unknown User";

        // Fetch project name
        const projectRef = doc(db, "Project", req.projectId);
        const projectSnap = await getDoc(projectRef);
        const projectName = projectSnap.exists() ? projectSnap.data().name : "Unknown Project";

        // Create request item
        const item = document.createElement("div");
        item.className = "request-item";
        item.innerHTML = `
            <p><strong>From:</strong> ${senderName}</p>
            <p><strong>Project:</strong> ${projectName}</p>
            <button onclick="acceptRequest('${req.id}', '${req.projectId}', '${req.senderId}')">
                Accept & Chat
            </button>
        `;
        container.appendChild(item);
    } catch (err) {
        console.error("Failed to fetch sender/project info:", err);
    }
});
}
// Accept request and open chat
window.acceptRequest = async function (requestId, projectId, senderId) {
    try {
        await acceptCollaborationRequest(requestId, projectId, senderId);

        // Save sender info for chat context
        localStorage.setItem("ChatWithUserId", senderId);
        localStorage.setItem("ChatProjectId", projectId);

        // Navigate to search.html where chat is implemented
        window.location.href = "search.html";
    } catch (error) {
        console.error("Error accepting request:", error);
        alert("Failed to accept request.");
    }
};

window.addEventListener("DOMContentLoaded", () => {
    updateProfileDisplay();
    loadCollabRequests(); // also add this if you want collaboration section to load
});

