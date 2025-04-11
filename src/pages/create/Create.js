/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Select from "react-select";
import { useCollection } from "../../hooks/useCollection";
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import "./Create.css";
import { useNavigate } from "react-router-dom";
import loadingGif from '../../assets/Loader.svg'

console.log(timestamp);
const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sconstruction", label: "Construction" },
  { value: "Monitoring & Evaluation", label: "Monitoring & Evaluation" },
];

export default function Create() {
  const navigate = useNavigate();
  const { addDocument, isPending, response } = useFirestore("projects");
  const { documents } = useCollection("users");
  const { documents: allProjects } = useCollection("projects");
  const [users, setUsers] = useState([]);

  const { user } = useAuthContext();

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => {
        return { value: user, label: user.displayName };
      });
      setUsers(options);
    }
  }, [documents]);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Check for duplicate name
  const nameExists = allProjects?.some(
    (project) => project.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (nameExists) {
    setFormError("A project with this name already exists.");
    return;
  }

  if (!category) {
    setFormError("You have to choose a category.");
    return;
  }

  if (assignedUsers.length < 1) {
    setFormError("You have to assign users.");
    return;
  }

  setFormError(null);
  setIsSubmitting(true);

  const createdBy = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    id: user.uid,
  };

  const assignedUsersList = assignedUsers.map((user) => ({
    displayName: user.value.displayName,
    photoURL: user.value.photoURL,
    id: user.value.id,
  }));

  const project = {
    name,
    details,
    category: category.value,
    dueDate: timestamp(new Date(dueDate)),
    comments: [],
    createdBy,
    assignedUsersList,
    tasks: [],
  };

  await addDocument(project);
  if (!response.error) {
    navigate("/");
  }

  setIsSubmitting(false);
};


  return (
    <div className="create-form pl-5 pages-margin">
      {/* <h2 className="page-title">Create new project</h2> */}
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project Name:</span>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>
        </label>
        <label>
          <span>Project Details:</span>
          <textarea
            type="text"
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>

        <label>
          <span>Due date::</span>
          <input
            type="date"
            // required
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          ></input>
        </label>
        <label>
          <span>Project category:</span>
          <Select
            options={categories}
            onChange={(option) => setCategory(option)}
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            options={users}
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>

        {/* {!isPending && <button className="btn">Add project</button>} */}
        {formError && <p className="error">{formError}</p>}

        <button
          className="min-h-12 bg-[var(--text-color)] rounded-xl p-4 text-white"
          disabled={isPending || isSubmitting}
        >
          {isPending || isSubmitting ? "Adding project..." : "Add project"}
        </button>
      </form>
    </div>
  );
}