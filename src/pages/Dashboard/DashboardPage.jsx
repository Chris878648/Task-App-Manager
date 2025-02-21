import React, { useEffect, useState } from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/get_tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const tasksData = await response.json();
          setTasks(tasksData);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

    const intervalId = setInterval(fetchTasks, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dashboard-container">
      {tasks.map(task => (
        <div key={task.id} className="task-card">
          <h3>{task.name}</h3>
          <p>Status: {task.status}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;