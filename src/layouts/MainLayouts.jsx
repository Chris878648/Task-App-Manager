import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const MainLayout = ({ children }) => {
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/get_users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const showTaskModal = () => {
    setIsTaskModalVisible(true);
  };

  const handleTaskOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Task added successfully!');
        setIsTaskModalVisible(false);
        form.resetFields();
      } else {
        const errorData = await response.json();
        message.error(`Failed to add task: ${errorData.message}`);
      }
    } catch (error) {
      console.log('Validation failed:', error);
      message.error('Failed to add task');
    }
  };

  const handleTaskCancel = () => {
    setIsTaskModalVisible(false);
    form.resetFields();
  };

  const showGroupModal = () => {
    setIsGroupModalVisible(true);
  };

  const handleGroupOk = async () => {
    try {
      const values = await groupForm.validateFields();
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Group created successfully!');
        setIsGroupModalVisible(false);
        groupForm.resetFields();
      } else {
        const errorData = await response.json();
        message.error(`Failed to create group: ${errorData.message}`);
      }
    } catch (error) {
      console.log('Validation failed:', error);
      message.error('Failed to create group');
    }
  };

  const handleGroupCancel = () => {
    setIsGroupModalVisible(false);
    groupForm.resetFields();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Layout className="main-layout">
      <Sider className="main-sider">
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className="main-menu">
          <Menu.Item key="1">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/menu">Menu</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/perfil">Perfil</Link>
          </Menu.Item>
        </Menu>
        <Button className="floating-button" type="primary" onClick={showTaskModal}>
          Add Task
        </Button>
        <Button className="floating-button" type="primary" onClick={showGroupModal}>
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
          <div className="content-inner">
            {children}
          </div>
        </Content>
        <Modal
          title="Add Task"
          visible={isTaskModalVisible}
          onOk={handleTaskOk}
          onCancel={handleTaskCancel}
          okButtonProps={{ className: 'modal-ok-button' }}
          cancelButtonProps={{ className: 'modal-cancel-button' }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name Task" rules={[{ required: true, message: 'Please input the task name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="time" label="Time until finish / Remind me" rules={[{ required: true, message: 'Please select the time!' }]}>
              <DatePicker showTime />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the status!' }]}>
              <Select>
                <Option value="In Progress">In Progress</Option>
                <Option value="Done">Done</Option>
                <Option value="Paused">Paused</Option>
                <Option value="Revision">Revision</Option>
              </Select>
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please input the category!' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Create Group"
          visible={isGroupModalVisible}
          onOk={handleGroupOk}
          onCancel={handleGroupCancel}
          okButtonProps={{ className: 'modal-ok-button' }}
          cancelButtonProps={{ className: 'modal-cancel-button' }}
        >
          <Form form={groupForm} layout="vertical">
            <Form.Item name="name" label="Group Name" rules={[{ required: true, message: 'Please input the group name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="userEmails" label="Add Users" rules={[{ required: true, message: 'Please select users!' }]}>
              <Select mode="multiple" placeholder="Select users">
                {users.map(user => (
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