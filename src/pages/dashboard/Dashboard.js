import React, { useState, useMemo } from 'react';
import ProjectsList from '../../components/ProjectsList';
import ProjectsFilter from './ProjectsFilter';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import ActiveProjectsCount from './ActiveProjectsCount';
import './Dashboard.css';

const Dashboard = () => {
  const { documents, error } = useCollection('projects');
  const [currentFilter, setCurrentFilter] = useState('Active');
  const { user } = useAuthContext();

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  const filteredProjects = useMemo(() => {
    if (!documents) return [];

    return documents.filter((document) => {
      const isCompleted = document.completed || false;

      switch (currentFilter) {
        case 'Active':
          return (
            (document.createdBy.id === user.uid ||
              document.assignedUsersList.some((u) => u.id === user.uid)) &&
            !isCompleted
          );
        case 'development':
        case 'design':
        case 'sales':
        case 'marketing':
          return document.category === currentFilter && !isCompleted;
        case 'Completed':
          return isCompleted;
        default:
          return true;
      }
    });
  }, [documents, currentFilter, user.uid]);

  return (
    <div className="dashboard w-[80%] pl-5 pages-margin">
      {error && <p className="error">{error}</p>}
      {documents && (
        <div>
          <ProjectsFilter currentFilter={currentFilter} changeFilter={changeFilter} />
          <ActiveProjectsCount projects={documents} />
        </div>
      )}
      {filteredProjects && <ProjectsList projects={filteredProjects} />}
    </div>
  );
};

export default Dashboard;
