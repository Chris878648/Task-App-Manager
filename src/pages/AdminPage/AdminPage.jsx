import React, { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../../services/taskService';
import { logout } from '../../services/authService';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 


const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const { id, username, email, type } = editingUser;
      const userData = { username, email, type };
      await updateUser(id, userData);
      toast.success('User updated successfully!');
      setEditingUser(null);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token'); 
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout');
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <form className="edit-form" onSubmit={handleUpdateUser}>
          <h2>Edit User</h2>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={editingUser.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editingUser.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={editingUser.password}
              onChange={handleChange}
              disabled={true} 
            />
          </div>
          <div>
            <label>Role:</label>
            <input
              type="number"
              name="type"
              value={editingUser.type}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update User</button>
        </form>
      )}

      {/* Botón de cierre de sesión */}
      <button className="logout-button1" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminPage;