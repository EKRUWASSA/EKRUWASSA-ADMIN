import { useParams, NavLink, Route, Routes } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import ProjectSummary from "./ProjectSummary";
import ProjectComments from "./ProjectComments";
import ProjectTasks from "./ProjectTasks";
import "./Project.css";

export default function Project() {
  const { id } = useParams();
  const { document, error } = useDocument("projects", id);

  if (error) {
    return <div className="error project-margin">{error}</div>;
  }

  if (!document) {
    return <div className="loading project-margin">loading....</div>;
  }

  return (
    <div className="project-details md:w-[80%] md:pl-5 pages-margin">
      <nav className="navbar">
        <NavLink
          to={`/projects/${id}`} // Absolute path to project summary
          end
          className={({ isActive }) =>
            isActive ? "nav-icon active" : "nav-icon"
          }
        >
          Summary
        </NavLink>
        <NavLink
          to={`/projects/${id}/tasks`} // Absolute path to tasks
          className={({ isActive }) =>
            isActive ? "nav-icon active" : "nav-icon"
          }
        >
          Tasks
        </NavLink>
        <NavLink
          to={`/projects/${id}/comments`} // Absolute path to comments
          className={({ isActive }) =>
            isActive ? "nav-icon active" : "nav-icon"
          }
        >
          Comments
        </NavLink>
      </nav>

      <div>
        <Routes>
          <Route path="" element={<ProjectSummary project={document} />} />
          <Route path="tasks" element={<ProjectTasks project={document} />} />
          <Route path="comments" element={<ProjectComments project={document} />} />
        </Routes>
      </div>
    </div>
  );
}
