import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, createTask, createGroup } from "../services/taskService";
import { logout } from "../services/authService";
import "./MainLayout.css";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons"; 

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const MainLayout = ({ children }) => {
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  // Mostrar modal de tarea
  const showTaskModal = () => {
    setIsTaskModalVisible(true);
  };

  // Manejar la creación de una tarea
  const handleTaskOk = async () => {
    try {
      const values = await form.validateFields();
      await createTask(values); 
      message.success("Task added successfully!");
      toast.success("Task added successfully!");
      setIsTaskModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating task:", error);
      message.error("Failed to add task");
      toast.error("Failed to add task");
    }
  };

  // Cancelar modal de tarea
  const handleTaskCancel = () => {
    setIsTaskModalVisible(false);
    form.resetFields();
  };

  // Mostrar modal de grupo
  const showGroupModal = () => {
    setIsGroupModalVisible(true);
  };

  // Manejar la creación de un grupo
  const handleGroupOk = async () => {
    try {
      const values = await groupForm.validateFields();
      await createGroup(values); 
      message.success("Group created successfully!");
      toast.success("Group created successfully!");
      setIsGroupModalVisible(false);
      groupForm.resetFields();
    } catch (error) {
      console.error("Error creating group:", error);
      message.error("Failed to create group");
      toast.error("Failed to create group");
    }
  };

  // Cancelar modal de grupo
  const handleGroupCancel = () => {
    setIsGroupModalVisible(false);
    groupForm.resetFields();
  };

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout(); 
      localStorage.removeItem("token");
      toast.success('Login successful!');
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      message.error("Failed to logout");
    }
  };

  return (
    <Layout className="main-layout">
      <Sider className="main-sider">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="main-menu"
        >
          <Menu.Item key="1">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
        </Menu>
        <Button
          className="floating-button"
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          onClick={showTaskModal}
        />
        <Button
          className="floating-button22"
          type="primary"
          onClick={showGroupModal}
        >
          Create Group
        </Button>
        <Button className="logout-button" type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Sider>
      <Layout>
        <Header className="main-header">
          <h1 className="header-title">Task Manager</h1>
        </Header>
        <Content className="main-content">
          <div className="content-inner">{children}</div>
        </Content>
        <Modal
          title="Add Task"
          visible={isTaskModalVisible}
          onOk={handleTaskOk}
          onCancel={handleTaskCancel}
          okButtonProps={{ className: "modal-ok-button" }}
          cancelButtonProps={{ className: "modal-cancel-button" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name Task"
              rules={[
                { required: true, message: "Please input the task name!" },
              ]}
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
                <Option value="In Progress">In Progress</Option>
                <Option value="Done">Done</Option>
                <Option value="Paused">Paused</Option>
                <Option value="Revision">Revision</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[
                { required: true, message: "Please input the category!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Create Group"
          visible={isGroupModalVisible}
          onOk={handleGroupOk}
          onCancel={handleGroupCancel}
          okButtonProps={{ className: "modal-ok-button" }}
          cancelButtonProps={{ className: "modal-cancel-button" }}
        >
          <Form form={groupForm} layout="vertical">
            <Form.Item
              name="name"
              label="Group Name"
              rules={[
                { required: true, message: "Please input the group name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="userEmails"
              label="Add Users"
              rules={[{ required: true, message: "Please select users!" }]}
            >
              <Select mode="multiple" placeholder="Select users">
                {users.map((user) => (
                  <Option key={user.email} value={user.email}>
                    {user.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
