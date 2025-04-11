import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Avatar from "../../components/Avatar";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import Done from "../../assets/tick.svg";
import {
  Calendar,
  MapPin,
  Users,
  Info,
  Check,
  PlusCircle,
  User,
  CheckCircle,
  Edit3,
} from "lucide-react";

export default function ProjectSummary({ project }) {
  const { updateDocument } = useFirestore("projects");
  const { user } = useAuthContext();
  const { documents } = useCollection("users");
  const navigate = useNavigate();

  const [location, setLocation] = useState(project.location || null);
  const [manualLocation, setManualLocation] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const isProjectCompleted = project.completed;

  const handleManualLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const geoLocation = {
      lat: parseFloat(manualLocation.lat),
      lng: parseFloat(manualLocation.lng),
    };

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
    setManualLocation((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (documents) {
      // Filter out users already assigned to the project
      const assignedUserIds = project.assignedUsersList.map((user) => user.id);
      const availableUsers = documents
        .filter((doc) => !assignedUserIds.includes(doc.id))
        .map((doc) => ({
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

    const updatedAssignedUsersList = [
      ...project.assignedUsersList,
      ...newUsers,
    ];

    await updateDocument(project.id, {
      assignedUsersList: updatedAssignedUsersList,
    });
    setSelectedUsers([]);
    setError(null);

    // Update the list of available users after adding
    const updatedUserIds = updatedAssignedUsersList.map((user) => user.id);
    const availableUsers = documents
      .filter((doc) => !updatedUserIds.includes(doc.id))
      .map((doc) => ({
        value: doc,
        label: doc.displayName,
      }));
    setUsers(availableUsers);
  };

  return (
    <div className="project-summary p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="project-title text-2xl font-bold flex items-center gap-2">
          <Edit3 size={20} className="text-blue-500" />
          {project.name}
        </h2>
        {isProjectCompleted && (
          <div className="complete flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
            <CheckCircle size={18} />
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="by flex items-center text-gray-600">
            <User size={16} className="mr-2" />
            <span className="font-medium">Created by:</span>{" "}
            {project.createdBy.displayName}
          </p>

          <p className="due-date flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="font-medium">Due date:</span>{" "}
            {project.dueDate.toDate().toDateString()}
          </p>

          <div className="details">
            <div className="flex items-center mb-2 text-gray-600">
              <Info size={16} className="mr-2" />
              <span className="font-medium">Details:</span>
            </div>
            <p className="ml-6 text-gray-700">{project.details}</p>
          </div>

          <div className="assigned-users-section">
            <div className="flex items-center mb-3 text-gray-600">
              <Users size={16} className="mr-2" />
              <h4 className="font-medium text-xl">Project Team:</h4>
            </div>
            <div className="assigned-users flex flex-wrap gap-2 ml-6">
              {project.assignedUsersList.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1 bg-gray-100 p-4 rounded-lg"
                >
                  <Avatar src={user.photoURL} displayName={user.displayName} />
                  <span className="text-xl text-gray-700">
                    {user.displayName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="location-section border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center mb-3 text-gray-600">
              <MapPin size={16} className="mr-2" />
              <h4 className="font-medium">Location:</h4>
            </div>

            {location && (
              <div className="mb-4 ml-6">
                <p className="text-gray-700 mb-3">
                  Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-12 bg-[var(--text-color)] rounded-xl p-3 text-white inline-flex items-center gap-2"
                >
                  <MapPin size={16} />
                  View on Maps
                </a>
              </div>
            )}

            <div className="manual-location-input">
              <form onSubmit={handleManualLocationSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-lg text-gray-600">Latitude:</span>
                    <input
                      type="text"
                      name="lat"
                      value={manualLocation.lat}
                      onChange={handleManualLocationChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </label>
                  <label className="block">
                    <span className="text-lg text-gray-600">Longitude:</span>
                    <input
                      type="text"
                      name="lng"
                      value={manualLocation.lng}
                      onChange={handleManualLocationChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </label>
                </div>
                <button
                  className="min-h-12 bg-[var(--text-color)] rounded-xl p-3 text-white inline-flex items-center gap-2"
                  type="submit"
                  disabled={loading}
                >
                  <MapPin size={16} />
                  {loading ? "Updating Location..." : "Set Location"}
                </button>
              </form>
            </div>
          </div>

          <div className="add-users mt-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center mb-3 text-gray-600">
              <PlusCircle size={16} className="mr-2" />
              <div className="text-lg font-medium">Add Team Members</div>
            </div>
            <Select
              options={users}
              onChange={(option) => setSelectedUsers(option)}
              isMulti
              className="mb-3"
              placeholder="Select users to add..."
            />
            <button
              className="min-h-12 bg-[var(--text-color)] rounded-xl p-3 text-white inline-flex items-center gap-2"
              onClick={handleAddUsers}
            >
              <Users size={16} />
              Add Users
            </button>
            {error && <p className="error text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>

      {!isProjectCompleted && user.uid === project.createdBy.id && (
        <div className="mt-8 flex justify-center">
          <button
            className="min-h-12 bg-blue-300 rounded-xl p-4 text-white inline-flex items-center gap-2"
            onClick={handleCompleteClick}
          >
            <Check size={18} />
            Mark project as complete
          </button>
        </div>
      )}
    </div>
  );
}
