import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Avatar from "../../components/Avatar";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import Done from '../../assets/tick.svg';

export default function ProjectSummary({ project }) {
  const { updateDocument } = useFirestore("projects");
  const { user } = useAuthContext();
  const { documents } = useCollection("users");
  const navigate = useNavigate();

  const [location, setLocation] = useState(project.location || null);
  const [manualLocation, setManualLocation] = useState({ lat: '', lng: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const isProjectCompleted = project.completed;

  const handleManualLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const geoLocation = { lat: parseFloat(manualLocation.lat), lng: parseFloat(manualLocation.lng) };

    if (isNaN(geoLocation.lat) || isNaN(geoLocation.lng)) {
      setError("Invalid latitude or longitude.");
      setLoading(false);
      return;
    }

    setLocation(geoLocation);

    await updateDocument(project.id, { location: geoLocation });
    setLoading(false);
  };

  const handleManualLocationChange = (e) => {
    const { name, value } = e.target;
    setManualLocation(prevState => ({ ...prevState, [name]: value }));
  };


  useEffect(() => {
    if (documents) {
      // Filter out users already assigned to the project
      const assignedUserIds = project.assignedUsersList.map(user => user.id);
      const availableUsers = documents
        .filter(doc => !assignedUserIds.includes(doc.id))
        .map(doc => ({
          value: doc,
          label: doc.displayName,
        }));
      setUsers(availableUsers);
    }
  }, [documents, project.assignedUsersList]);

  const handleCompleteClick = async (e) => {
    e.preventDefault();
    await updateDocument(project.id, { completed: true });
  };

  const handleAddUsers = async (e) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      setError("No users selected.");
      return;
    }

    const newUsers = selectedUsers.map((user) => ({
      displayName: user.value.displayName,
      photoURL: user.value.photoURL,
      id: user.value.id,
    }));

    const updatedAssignedUsersList = [...project.assignedUsersList, ...newUsers];

    await updateDocument(project.id, { assignedUsersList: updatedAssignedUsersList });
    setSelectedUsers([]);
    setError(null);

    // Update the list of available users after adding
    const updatedUserIds = updatedAssignedUsersList.map(user => user.id);
    const availableUsers = documents
      .filter(doc => !updatedUserIds.includes(doc.id))
      .map(doc => ({
        value: doc,
        label: doc.displayName,
      }));
    setUsers(availableUsers);
  };

  return (
    <div className="project-summary">
      <h2 className="project-title">Project Name: {project.name}</h2>
      <p className="by">By: {project.createdBy.displayName}</p>
      <p className="due-date">
        Project due by {project.dueDate.toDate().toDateString()}
      </p>
      <p className="details">Details: {project.details}</p>
      <h4>Project is Assigned to:</h4>
      <div className="assigned-users">
        {project.assignedUsersList.map((user) => (
          <div key={user.id}>
            <Avatar src={user.photoURL} displayName={user.displayName} />
          </div>
        ))}
      </div>

      <div className="location-input">
        {/* <button className="btn" onClick={handleLocationClick} disabled={loading}>
          {loading ? "Updating Location..." : "Set Location"}
        </button> */}
        {error && <p className="error">{error}</p>}
        {location && (
          <div className="">
            <p>
              Location: Lat {location.lat}, Lng {location.lng}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-6"
            >
              View Location
            </a>
          </div>
        )}
      </div>

      <div className="">
        <div className="manual-location-input">
          <form onSubmit={handleManualLocationSubmit}>
            <label>
              <span>Latitude:</span>
              <input
                type="text"
                name="lat"
                value={manualLocation.lat}
                onChange={handleManualLocationChange}
              />
            </label>
            <label>
              <span>Longitude:</span>
              <input
                type="text"
                name="lng"
                value={manualLocation.lng}
                onChange={handleManualLocationChange}
              />
            </label>
            <div className="gap-8 flex">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Updating Location..." : "Set Location"}
              </button>

              {isProjectCompleted && (
                <div className="complete">
                  <img src={Done} alt="complete" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="add-users mt-4">
        <div className="text-xl">Add More Users:</div>
        <Select
          options={users}
          onChange={(option) => setSelectedUsers(option)}
          isMulti
        />
        <button className="btn" onClick={handleAddUsers}>
          Add Users
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {!isProjectCompleted && user.uid === project.createdBy.id && (
        <button className="btn" onClick={handleCompleteClick}>
          Mark project as complete
        </button>
      )}

      {isProjectCompleted && (
        <div className="complete">
          <img src={Done} alt="complete" />
          <span>Completed</span>
        </div>
      )}
    </div>
  );
}
