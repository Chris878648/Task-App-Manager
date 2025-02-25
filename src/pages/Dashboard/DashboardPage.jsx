import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, DatePicker, message } from "antd";
import "./DashboardPage.css";

const { Option } = Select;

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [form] = Form.useForm();

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/get_tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const tasksData = await response.json();
          setTasks(tasksData);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/get_groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const groupsData = await response.json();
          setGroups(groupsData);
        } else {
          console.error("Failed to fetch groups");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    const fetchUserTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/get_tasks_byuser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userTasksData = await response.json();
          setUserTasks(userTasksData);
        } else {
          console.error("Failed to fetch user tasks");
        }
      } catch (error) {
        console.error("Error fetching user tasks:", error);
      }
    };

    const fetchUserGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/get_groups_byuser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const userGroupsData = await response.json();
          setUserGroups(userGroupsData);
        } else {
          console.error("Failed to fetch user groups");
        }
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };

    fetchTasks();
    fetchGroups();
    fetchUserTasks();
    fetchUserGroups();

    const intervalId = setInterval(() => {
      fetchTasks();
      fetchGroups();
      fetchUserTasks();
      fetchUserGroups();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchGroupTasks = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/groups/${groupId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const groupTasks = await response.json();
        setTasks((prevTasks) => [...prevTasks, ...groupTasks]);
      } else {
        console.error("Failed to fetch group tasks");
      }
    } catch (error) {
      console.error("Error fetching group tasks:", error);
    }
  };

  useEffect(() => {
    groups.forEach((group) => {
      fetchGroupTasks(group.id);
    });
  }, [groups]);

  // Agrupar tareas por estado
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  const groupedUserTasks = userTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        setUserTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        message.success("Task status updated successfully!");
      } else {
        console.error("Failed to update task status");
        message.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      message.error("Error updating task status");
    }
  };

  const showModal = (group) => {
    setSelectedGroup(group);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/groups/${selectedGroup.id}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        message.success("Task added successfully!");
        setIsModalVisible(false);
        form.resetFields();
      } else {
        const errorData = await response.json();
        message.error(`Failed to add task: ${errorData.message}`);
      }
    } catch (error) {
      console.log("Validation failed:", error);
      message.error("Failed to add task");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Estados para el tablero Kanban
  const statuses = ["In Progress", "Done", "Paused", "Revision"];

  // Función para renderizar el tablero Kanban
  const renderKanbanBoard = (tasks) => {
    return (
      <div className="kanban-board">
        {statuses.map((status) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>
            {tasks[status]?.map((task) => (
              <div key={task.id} className="task-card">
                <h4>{task.name}</h4>
                <p>Description:{task.description} </p>
                <p>Assigned to: {task.assignedTo}</p>
                {task.assignedTo === userEmail && (
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sección de Group Tasks */}
      <div className="section-container">
        <h2>Group Tasks</h2>
        {groups.map((group) => (
          <div key={group.id}>
            <h3>{group.name}</h3>
            <Button type="primary" onClick={() => showModal(group)}>
              Add Task
            </Button>
            {renderKanbanBoard(
              tasks
                .filter((task) => task.groupId === group.id)
                .reduce((acc, task) => {
                  if (!acc[task.status]) acc[task.status] = [];
                  acc[task.status].push(task);
                  return acc;
                }, {})
            )}
          </div>
        ))}
      </div>

      {/* Sección de My Tasks */}
      <div className="section-container">
        <h2>My Tasks</h2>
        {renderKanbanBoard(
          tasks
            .filter((task) => !task.groupId)
            .reduce((acc, task) => {
              if (!acc[task.status]) acc[task.status] = [];
              acc[task.status].push(task);
              return acc;
            }, {})
        )}
      </div>

      {/* Sección de Assigned Tasks */}
      <div className="section-container">
        <h2>Assigned Tasks</h2>
        {renderKanbanBoard(groupedUserTasks)}
      </div>

      {/* Modal para agregar tareas */}
      <Modal
        title="Add Task"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ className: "modal-ok-button" }}
        cancelButtonProps={{ className: "modal-cancel-button" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: "Please input the task name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="time"
            label="Time until finish / Remind me"
            rules={[{ required: true, message: "Please select the time!" }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              {statuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input the category!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="assignedTo"
            label="Assign to"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select placeholder="Select a user">
              {selectedGroup &&
                selectedGroup.userEmails.map((email) => (
                  <Option key={email} value={email}>
                    {email}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
