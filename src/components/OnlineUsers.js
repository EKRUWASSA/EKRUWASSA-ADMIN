import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useRef } from "react";
import { useCollection } from "../hooks/useCollection";
import { projectFirestore } from "../firebase/config";
import Avatar from "./Avatar";
import Users from '../assets/users.png';

import "./OnlineUsers.css";

export default function OnlineUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { error, documents } = useCollection("users");
  const { user } = useAuthContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [addError, setAddError] = useState("");
  const [successModal, setSuccessModal] = useState(false); // State for success modal
  const [loading, setLoading] = useState(false); // State for loading
  const [selectedImage, setSelectedImage] = useState(null); // State for enlarged image
  const dropdownRef = useRef(null);

  const handleClick = async (user) => {
    try {
      const userDetails = await getUserDetails(user.id);
      setSelectedUser(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

  const getUserDetails = async (userId) => {
    const userDoc = await projectFirestore.collection("users").doc(userId).get();
    return userDoc.data();
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim()) {
      setAddError("Please enter at least one valid email.");
      return;
    }
  
    const emailArray = newUserEmail
      .split(/[\n,]+/) // Split by newline or comma
      .map((email) => email.trim().toLowerCase()) // Normalize emails
      .filter((email) => email); // Remove empty entries
  
    if (emailArray.length === 0) {
      setAddError("Please enter at least one valid email.");
      return;
    }
  
    setLoading(true);
    try {
      const batch = projectFirestore.batch();
      const now = new Date();
  
      emailArray.forEach((email) => {
        const docRef = projectFirestore.collection("approvedEmails").doc(email);
        batch.set(docRef, {
          email,
          addedBy: user.uid,
          createdAt: now,
        });
      });
  
      await batch.commit();
      setNewUserEmail("");
      setAddError("");
      setSuccessModal(true);
      setTimeout(() => setSuccessModal(false), 3000);
    } catch (error) {
      console.error("Error adding batch emails:", error.message);
      setAddError("Failed to add some or all emails. Try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleImageClick = (photoURL) => {
    console.log("Clicked image:", photoURL); // Debugging
    setSelectedImage(photoURL); // Set selected image URL when photo is clicked
  };
  

  const handleCloseImageModal = () => {
    setSelectedImage(null); // Close modal by resetting the selected image
  };


  const getInitialsImage = (name) => {
    if (!name) return "https://ui-avatars.com/api/?name=User&background=random"; 
    const formattedName = name.replace(/\s+/g, "+"); // Convert spaces to '+'
    return `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
  };
  
  return (
    <div className="user-list-container pages-margin">
      <div className="header">
        <div className="add-user-form">
        <textarea
  value={newUserEmail}
  onChange={(e) => setNewUserEmail(e.target.value)}
  placeholder="Enter emails separated by commas or new lines"
  rows="4"
  className="email-textarea"
/>



          <button className="add-email-button" onClick={handleAddUser} disabled={loading}>
            {loading ? "Adding..." : "Add Email(s)"} 
          </button>
          {addError && <p className="error">{addError}</p>}
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="user-list" ref={dropdownRef}>
        <h2>Registered Users</h2>
        {error && <div className="error">{error}</div>}
        {documents &&
          documents
            .filter((currentUser) =>
              currentUser.id !== user.uid &&
              currentUser.displayName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((user) => (
              <div
                key={user.id}
                className="user-list-item"
                onClick={() => handleClick(user)}
              >
              <img
                className="avatar"
                src={user.photoURL || getInitialsImage(user.displayName)}
                alt={user.displayName}
                onClick={() => handleImageClick(user.photoURL)}
              />
                <div className="user-info">
                  <span>{user.displayName}</span>
                  <span className="user-email">{user.email}</span> 
                </div>
              </div>
            ))}
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="success-modal">
          <div className="success-modal-content">
            <p>Email successfully added!</p>
            <button onClick={() => setSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Enlarge Image Modal */}
  {/* Enlarge Image Modal */}
{selectedImage && (
  <div className="image-modal" onClick={handleCloseImageModal}>
    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
      <img src={selectedImage} alt="Enlarged profile" className="enlarged-image" />
      {/* <button onClick={handleCloseImageModal}>Close</button> */}
    </div>
  </div>
)}

    </div>
  );
}
