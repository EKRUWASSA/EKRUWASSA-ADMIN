/* eslint-disable no-dupe-keys */
import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useRef, useEffect } from "react";
import { useCollection } from "../hooks/useCollection";
import { projectFirestore } from "../firebase/config";
import Avatar from "./Avatar";
import Users from '../assets/users.png';

import "./OnlineUsers.css";

// Map of emails to company names
const emailToCompanyMap = {
  "tubosunosanyinlusi@gmail.com": "2T'S & OLA MULTI-VENTURES",
  "ojojamesakinola@gmail.com": "ABOLUS ULTIMATE ABOLUWAJI VENTURES",
  "kunlehammed0@gmail.com": "ADEMED WORLDWIDE ENTERPRISES",
  "adebayookesola52@gmail.com": "ADENELOKE FOUNTAIN OF HOPE ENT.",
  "haimhalle1@gmail.com": "ADRIM LTD",
  "morenikejibolaji9@gmail.com": "AJEBOL & SONS MULTI-PURPOSE LTD",
  "ajosam2002@gmail.com": "AJOSAM INVESTMENT COMPANY LTD",
  "biyifashoyin@gmail.com": "ALAKO Global Investment",
  "oladeleayodeji90@gmail.com": "ALASI AYINKUN'S INTEGRATED SERVICES",
  "akinboadey@gmail.com": "ALE TEPP-VIC MULTINATIONAL BIZ CONCEPT",
  "aquifer.resources@gmail.com": "AQUIFERS DRILL POINT RESOURCES",
  "ayotooni@gmail.com": "BAKUISU NIG. LTD",
  "temitopeomowumi@gmail.com": "BEDROCK INTEGRATED NIG LTD",
  "ngozi.agharanya14@gmail.com": "BENZENE INTEGRATED RESOURCES COMPANY",
  "adeleyeakinloluolumide@gmail.com": "BISOLAB VENTURES LTD",
  "bjegventures20@gmail.com": "BJEG VENTURES NIGERIA LTD",
  "akintope86@gmail.com": "BLUE OFFSHORE GLOBAL SERVICES",
  "ganiyusanni65@gmail.com": "BOAB ENGINEERING SERVICES LTD",
  "bsamintltd@gmail.com": "B-SAM INTL COMPANY LTD.",
  "dejionibunmi@gmail.com": "BUMMY-DEE ROYAL NIG ENT.",
  "haimhalle1@gmail.com": "CALLENDER REALTY NIG. LTD",
  "charlibot@gmail.com": "CHARLIBOT GEOTECH COMPANY LTD",
  "cresxendodynamic007@gmail.com": "CRESCENDO DYNAMIC NIG. ENTERPRISES",
  "isiakademola@gmail.com": "CRESTHILL INTEGRATED RESOURCES LIMITED",
  "dare@dacitasplc.com": "DACITAS PLC",
  "taiwojumoke1234@gmail.com": "DANJONEST INTEGRATED RESOURCES LTD",
  "samodeyemi@gmail.com": "DEECAM ENGINEERING LIMITED",
  "dekueng3@gmail.com": "De-Ku constructions limited",
  "doublesolaglobalservices@gmail.com": "DOUBLESOLA GLOBAL SERVICES",
  "darpyrow@gmail.com": "EAI ENGINEERING SERVICES LTD",
  "earthmirrorgeotech@gmail.com": "EARTHMIRROR GEOTECH NIGERIA LIMITED",
  "edsaconstruction@gmail.com": "EDSA UNIVERSAL CONSTRUCTION NIG. LTD",
  "eseigbeluck@yahoo.com": "ELIPOD INTL CO. LTD",
  "faleyerotimi01@gmail.com": "eliz fol-pet ventures",
  "olugbengayewande01@yahoo.com": "ELLA 3 NIG. LTD",
  "biodunishola@yahoo.com": "ENARXIS INTERNATIONAL CONSULT LTD",
  "tope.fakayode@yahoo.com": "FAKTOPS GLOBAL CONCEPTS LTD",
  "owoeyeo48@gmail.com": "FARMO AND COLLEQUES LIMITED",
  "rsamchadi1010@gmail.com": "FDD GLOBAL INVESTMENT LTD",
  "ffventures@hotmail.com": "FEMI FADEYI VENTURES LTD",
  "oluwafemiadesoye595@gmail.com": "FEMI-SOYE INTERNERTIONAL COMPANY",
  "dennislaud@gmail.com": "FOREMAN ENGINEERING SERVICES LTD",
  "omotayobabarinde@gmail.com": "FORTHWILL NIG. LTD",
  "argboyega@gmail.com": "FOTAD GOLDEN HERITAGE VENTURES",
  "bolaalegbeleye@gmail.com": "FUMDEEJ GLOBAL VENTURES",
  "omotayo1610@gmail.com": "GLOBAL IMPACT ENVIROMENTAL CONSULTING LTD",
  "onileowopeter@gmail.com": "GOLDEN PETERS AND COMPANY LIMITED",
  "geogreenhome@gmail.com": "GREEN HOMES DYNAMICS RESOURCES LIMITED",
  "jimoh8292@gmail.com": "HAJO CONSTRUCTION LTD",
  "hallekemltd@gmail.com": "HALLEKEM LIMITED",
  "yinkusmilitas@gmail.com": "HANDY DAVE GLOBAL RESOURCES",
  "harimatconstruction@gmail.com": "HARIMATT INTEGRATED SERVICES NIGERIA LIMITED",
  "kehindeosikoya@yahoo.com": "HARMONIC PROJECT LTD",
  "oaoguntuyi@gmail.com": "HENRY J. GLOBAL VENTURES",
  "hysesnexwater@gmail.com": "HYSES-NEX COMPANY LIMITED",
  "ibuildengineering2017@gmail.com": "IBUILD ENGINEERING AND CONSULTANCY SERVICES LIMITED",
  "olueztayo123@gmail.com": "IGABY LUSSY NIGERIA LTD",
  "ismawater03@gmail.com": "ISMA WATER GLOBAL LIMITED",
  "jackpado@gmail.com": "J&T JAKPADO NIG. LTD",
  "kayfasae@yahoo.com": "JADFEM NIG. LTD",
  "ilesanmiadebimpe55@gmail.com": "JEDOM MULTIBIZ CONCEPT COMPANY",
  "enginegangan@gmail.com": "JIGATECH ENGINEERING SERVICES LTD",
  "jimmytessy2@gmail.com": "JIMTESSY MULTIBIZ GLOBAL COMPANY",
  "bayodefeyide@gmail.com": "Joey-Fey Multiglobal Company",
  "jalabidowu@gmail.com": "JONYETID NIGERIA ENTERPRISES",
  "junovdectechinvestltd@gmail.com": "JUNOVDEC TECH INVESTMENT LTD",
  "olajigakolade@gmail.com": "KOLADEB INTEGRATED SERVICES LTD",
  "ladmath@gmail.com": "LADMATH CIVIL CONSTRUCTION ENGINEERING",
  "femimacbeny@gmail.com": "LAFIK NIGERIA ENTERPRISES",
  "latemfamulticoncept@gmail.com": "LATEMFA MULTINATIONAL CONCEPT LIMITED",
  "princessadekemi44@gmail.com": "M & D SOLA MULTI GLOBAL RESOURCES",
  "haimhalle1@gmail.com": "MATERAH CONSTRUCTION LTD",
  "solacov@gmail.com": "MAT-LAD TECH NIG LTD",
  "netosam26@gmail.com": "MEMESAMMY MULTI CONCEPT GLOBAL",
  "micadebright975@gmail.com": "MIC- ADEBRIGHT MULTI-GLOBAL COMPANY",
  "michoganigltd@gmail.com": "MICH-OGA NIGERIA LTD",
  "hallekemltd@gmail.com": "MIHAL CONSULTANCY LTD",
  "ijaodolaoluwafemi007@gmail.com": "NEAT ROYAL VENTURES",
  "kunlegadeniyi@gmail.com": "O. C. C AND ASSOCIATES LTD",
  "bosunlusi@yahoo.com": "OLAM INTEGRATED MULTI-DYNAMIC LTD",
  "olujumex@gmail.com": "OLUJUMEX NIG. LTD",
  "famibola@gmail.com": "Onicon Resources Ltd",
  "oluwaseunadewumi1@gmail.com": "OYINSAK VENTURES",
  "p.aoninigent@gmail.com": "P.A. ONI NIG.LTD",
  "manuelolukayode@gmail.com": "PAPET LIMITED",
  "temitayoemmanuel764@gmail.com": "PERFECT BUILDER INTEGRATED SERVICES LTD.",
  "princealfredadeyanju@gmail.com": "PRINCE ALFRED ADEYANJU COMPANY",
  "emekaoster@gmail.com": "PURE VIC CONCEPTS",
  "rafortally@gmail.com": "Rafort ally Global Services",
  "raytol2000@yahoo.com": "RAYTOL FINISHING WORK LIMITED",
  "realgoldenhill@gmail.com": "REAL GOLDEN HILL MULTINATIONAL CONCEPT LIMITED",
  "gbenga.omope@yahoo.com": "REAL WORKMAN VENTURES INVESTMENT LTD",
  "realgokray@gmail.com": "REAL-GOKRAY CONSTRUCTION COMPANY LTD",
  "resetoil@yahoo.co.uk": "RESET ENGINEERING SERVICES LIMITED",
  "faleyerotimialbert@gmail.com": "ROFABERT RESOURCES NIG. LTD",
  "rsaminvestltd@gmail.com": "R-SAM INVESTMENT COMPANY NIG LTD",
  "layfas73@gmail.com": "SAM-FASH MULTI CONCEPT",
  "shilesconstruction@gmail.com": "SHILES CONSTRUCTION",
  "smartrockengineering@gmail.com": "SMART-ROCK ENGINEERING AND CONSULTANCY SERVICES LTD",
  "olasojiowolabi476@gmail.com": "SMASBOD GLOBAL RESOURCES LTD",
  "inioluwaadebiyi23@gmail.com": "ST. HORGE GLOBAL COMPANY",
  "suschrisbuildservices025@gmail.com": "SUSCHRIS BUILDING SERVICES",
  "tapsonaluminium@gmail.com": "TAPCO GLOBAL RESOURCE VENTURES",
  "olujepson@gmail.com": "TARAOL VENTURES",
  "akinpelutemitope79@gmail.com": "TEMTOP SCIENTIFIC NIGERIA LIMITED",
  "jegedeayo49@gmail.com": "TOJEC ENGINEERING SERVICES LTD",
  "titiloyeoluwayemi@gmail.com": "TOLIX GLOBAL RESOURCES LIMITED",
  "bamidelehenry06@gmail.com": "TOPYETTY GLOBAL CONCEPT",
  "vitals@vintagexpertsltd.com": "VITALS INTEGRATED AND GENERAL EXPERTS",
  "zaclawrenznigltd@gmail.com": "ZAC-LAWRENZ NIG LTD"
};

export default function OnlineUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { error, documents } = useCollection("users");
  const { user } = useAuthContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [addError, setAddError] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dropdownRef = useRef(null);

  const getCompanyName = (email) => {
    if (!email) return "No company information";
    
    const normalizedEmail = email.toLowerCase();
    return emailToCompanyMap[normalizedEmail] || "Company not found";
  };

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
          <button
            className="add-email-button"
            onClick={handleAddUser}
            disabled={loading}
          >
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
        <h2>
          Registered Users (
          {documents
            ? documents.filter(
                (currentUser) =>
                  currentUser.id !== user.uid &&
                  (currentUser.displayName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    currentUser.email
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()))
              ).length
            : 0}
          )
        </h2>
        {error && <div className="error">{error}</div>}
        {documents &&
          documents
            .filter(
              (currentUser) =>
                currentUser.id !== user.uid &&
                (currentUser.displayName
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                  currentUser.email
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()))
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
                  <span>{getCompanyName(user.email)}</span>
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
      {selectedImage && (
        <div className="image-modal" onClick={handleCloseImageModal}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged profile"
              className="enlarged-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}