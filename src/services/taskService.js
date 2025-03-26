import api from "./api";

// Función para crear una tarea
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todos los usuarios
export const getUsers = async () => {
  try {
    const response = await api.get('/get_users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todas las tareas del usuario autenticado
export const getTasks = async () => {
  try {
    const response = await api.get('/get_tasks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para crear un grupo
export const createGroup = async (groupData) => {
  try {
    const response = await api.post('/groups', groupData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todos los grupos del usuario autenticado
export const getGroups = async () => {
  try {
    const response = await api.get('/get_groups');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para crear una tarea en un grupo
export const createGroupTask = async (groupId, taskData) => {
  try {
    const response = await api.post(`/groups/${groupId}/tasks`, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todas las tareas de un grupo específico
export const getGroupTasks = async (groupId) => {
  try {
    const response = await api.get(`/groups/${groupId}/tasks`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todos los grupos del usuario autenticado por correo electrónico
export const getGroupsByUser = async () => {
  try {
    const response = await api.get('/get_groups_byuser');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todas las tareas asignadas al usuario autenticado
export const getTasksByUser = async () => {
  try {
    const response = await api.get('/get_tasks_byuser');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar el estado de una tarea
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar el estado de una tarea - Nueva va a GIT
export const updateTaskStatus_Personal = async (taskId, status) => {
  try {
    const response = await api.patch(`/tasks_personal/${taskId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/////////////////////////////////////////////////////
// Función para actualizar la información del usuario
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.patch(`/update_user/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error updating user information: ' + error.message);
  }
};
