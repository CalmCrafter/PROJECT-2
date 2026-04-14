import { db } from "./env.js";
import { collection, addDoc, getDocs, updateDoc, doc, query, where, arrayUnion } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Function to send a collaboration request
export async function sendCollaborationRequest(senderId, projectId, receiverId) {
 
  console.log("Sending request with:", { senderId, projectId, receiverId }); // Debugging log

  if (!senderId || !projectId || !receiverId) {
      console.error("Missing required fields:", { senderId, projectId, receiverId });
      return; 
  }

  try {
      const requestRef = collection(db, "collaborationRequests");

      await addDoc(requestRef, {
          senderId,
          projectId,
          receiverId,
          status: "pending",
          createdAt: new Date()
      });

      const projectRef = doc(db, "Project", projectId);
        await updateDoc(projectRef, {
            collabRequests: arrayUnion({ senderId, status: "pending", createdAt: new Date() })
        });

      alert("Collaboration request sent successfully!");
  } catch (error) {
      console.error("Error sending request:", error);
  }
}



// Function to get collaboration requests for the logged-in user
export async function getCollaborationRequests(userId) {
    const requests = [];
    try {
        const q = query(collection(db, "collaborationRequests"), where("receiverId", "==", userId), where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            requests.push({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
    }
    return requests;
}

// Function to accept a collaboration request
export async function acceptCollaborationRequest(requestId, projectId, senderId) {
  try {
      // Update request status to "accepted"
      const requestRef = doc(db, "collaborationRequests", requestId);
      await updateDoc(requestRef, { status: "accepted" });

      // Add sender to project's team members
      const projectRef = doc(db, "Project", projectId);
      await updateDoc(projectRef, {
          teamMembers: arrayUnion(senderId)
      });

      console.log("Collaboration request accepted.");
  } catch (error) {
      console.error("Error accepting request:", error);
  }
}

// Function to reject a collaboration request
export async function rejectCollaborationRequest(requestId) {
    try {
        const requestRef = doc(db, "collaborationRequests", requestId);
        await updateDoc(requestRef, { status: "rejected" });
        console.log("Collaboration request rejected.");
    } catch (error) {
        console.error("Error rejecting request:", error);
    }
}
