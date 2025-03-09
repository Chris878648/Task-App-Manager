import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, DatePicker, message } from "antd";
import "./DashboardPage.css";
import {
  getTasks,
  getGroups,
  getTasksByUser,
  getGroupsByUser,
  getGroupTasks,
  updateTaskStatus,
  createGroupTask,
} from "../../services/taskService"; 

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
    const fetchData = async () => {
      try {
        const tasksData = await getTasks();
        const groupsData = await getGroups();
        const userTasksData = await getTasksByUser();
        const userGroupsData = await getGroupsByUser();

        setTasks(tasksData);
        setGroups(groupsData);
        setUserTasks(userTasksData);
        setUserGroups(userGroupsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchGroupTasksData = async () => {
      try {
        for (const group of groups) {
          const groupTasks = await getGroupTasks(group.id);
          setTasks((prevTasks) => [...prevTasks, ...groupTasks]);
        }
      } catch (error) {
        console.error("Error fetching group tasks:", error);
      }
    };

    if (groups.length > 0) {
      fetchGroupTasksData();
    }
  }, [groups]);

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
      await updateTaskStatus(taskId, newStatus);
      
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
      
      await createGroupTask(selectedGroup.id, values);
      
      message.success("Task added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.log("Validation failed:", error);
      message.error("Failed to add task");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const statuses = ["In Progress", "Done", "Paused", "Revision"];

  const renderKanbanBoard = (tasks) => {
    return (
      <div className="kanban-board">
        {statuses.map((status) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>
            {tasks[status]?.map((task) => (
              <div key={task.id} className="task-card">
                <h4>{task.name}</h4>
                <p>Description: {task.description}</p>
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
      {/* Group Tasks Section */}
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

      {/* My Tasks Section */}
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

      {/* Assigned Tasks Section */}
      <div className="section-container">
        <h2>Assigned Tasks</h2>
        {renderKanbanBoard(groupedUserTasks)}
      </div>

      {/* Add Task Modal */}
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