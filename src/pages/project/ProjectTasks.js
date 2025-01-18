import { useState, useEffect } from "react";
import Avatar from "../../components/Avatar";
import Select from "react-select";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import Modal from "../../components/Modal";

export default function ProjectTasks({ project }) {
  const { updateDocument, response } = useFirestore("projects");

  const [newTask, setNewTask] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [formError, setFormError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (project) {
      const options = project.assignedUsersList.map((user) => {
        return { value: user, label: user.displayName };
      });
      setUsers(options);
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedUsers.length === 0) {
      setFormError("You must choose at least one user for the task.");
      return;
    }
  
    const taskToAdd = {
      content: newTask,
      assignedUsers: selectedUsers.map((selectedUser) => ({
        displayName: selectedUser.value.displayName,
        photoURL: selectedUser.value.photoURL,
        id: selectedUser.value.id,
      })),
      done: false,
      subtasks: subtasks.map((subtask) => ({ content: subtask, done: false })),
      id: Math.random(),
    };
  
    await updateDocument(project.id, {
      tasks: [...project.tasks, taskToAdd],
    });
  
    if (!response.error) {
      setNewTask("");
      setSubtasks([]);
      setSelectedUsers([]);
    }
  };
  

  const handleSelectAll = () => {
    setSelectedUsers(users);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() !== "") {
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtask("");
    }
  };

  const handleSubtaskChange = async (e, task, index) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[index].done = e.target.checked;
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    await updateDocument(project.id, {
      tasks: project.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    });
  };

  const calculateProgress = (subtasks) => {
    if (subtasks.length === 0) return 0;
    const completed = subtasks.filter((subtask) => subtask.done).length;
    return (completed / subtasks.length) * 100;
  };

  return (
    <div className="taskk">
      {user.uid === project.createdBy.id && (
        <>
          <div className="add-task-form">
            <form onSubmit={handleSubmit}>
              <label>
                <span>Type in a task:</span>
                <input
                  type="text"
                  required
                  onChange={(e) => setNewTask(e.target.value)}
                  value={newTask}
                />
              </label>

              <label>
                <span>Type in an activity:</span>
                <input
                  type="text"
                  onChange={(e) => setNewSubtask(e.target.value)}
                  value={newSubtask}
                />
                <button
                  type="button"
                  className="btn"
                  onClick={handleAddSubtask}
                >
                  Add Subtask
                </button>
              </label>

              <div className="added-subtasks">
                <h4>Subtasks:</h4>
                <ul>
                  {subtasks.map((subtask, index) => (
                    <li key={index}>{subtask}</li>
                  ))}
                </ul>
              </div>

              <div className="select-users">
                <Select
                  options={users}
                  isMulti
                  placeholder="Select user(s)"
                  value={selectedUsers}
                  className="task-select"
                  onChange={(selectedOptions) => setSelectedUsers(selectedOptions)}
                />
                <button
                  type="button"
                  className="btn select-all"
                  onClick={handleSelectAll}
                >
                  Select All
                </button>
              </div>

              <button type="submit" className="btn">
                Add Task
              </button>
            </form>

            {formError && <p className="error">{formError}</p>}
          </div>
        </>
      )}

<div className="tasks">
  <h2>{project.tasks.length > 0 ? "" : "No tasks yet"}</h2>
  {project.tasks &&
    project.tasks.map((task) => (
      <div key={task.id} className="task">
        <p className="task-content">{task.content.substr(0, 40)}</p>

        <div className="task-man">
      <p>Assigned to:</p>
      <div className="assigned-users" onClick={toggleModal}>
        {task.assignedUsers.slice(0, 3).map((user) => (
          <Avatar key={user.id} src={user.photoURL} className="task-img" />
        ))}
        {task.assignedUsers.length > 3 && (
          <span className="more-users">+{task.assignedUsers.length - 3}</span>
        )}
      </div>

      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onClose={toggleModal}
          className="task-assigned-modal-overlay"
        >
          <div className="task-assigned-modal-content">
            <h2 className="task-assigned-modal-title">Assigned Users</h2>
            <div className="task-assigned-modal-list">
              {task.assignedUsers.map((user) => (
                <div
                  key={user.id}
                  className="task-assigned-modal-user task-assigned-user"
                >
                  <Avatar src={user.photoURL} className="task-assigned-avatar" />
                  <p className="task-assigned-username">{user.displayName}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>

        <div className="subtasks">
          <div className="activity">ACTIVITIES</div>
          {(task.subtasks || []).map((subtask, index) => (
            <div key={index} className="subtask">
              <input
                type="checkbox"
                checked={subtask.done}
                onChange={(e) => handleSubtaskChange(e, task, index)}
              />
              <div className="stcontent">
                <div>{subtask.content}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="progress-bar">
          <CircularProgressbar
            value={calculateProgress(task.subtasks || [])}
            text={`${Math.round(calculateProgress(task.subtasks || []))}%`}
            styles={buildStyles({
              pathColor: "#33B06F",
              textColor: "#000",
              trailColor: "#e0e0de",
              textSize: "12px",
            })}
          />
        </div>
      </div>
    ))}
</div>

    </div>
  );
}
