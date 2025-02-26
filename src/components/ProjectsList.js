import React, { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import "./ProjectsList.css";

export default function ProjectsList({ projects }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="project-list-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Project List */}
      <div className="project-list">
        {filteredProjects.length === 0 && <p>There are no projects yet</p>}
        {filteredProjects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id}>
            <h4>{project.name}</h4>
            <p>{project.dueDate.toDate().toDateString()}</p>
            <div className="assigned-to">
              <ul>
                {project.assignedUsersList.map((user) => (
                  <li key={user.photoURL}>
                    <Avatar src={user.photoURL} displayName={user.displayName} />
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
