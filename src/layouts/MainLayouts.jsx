import React, { useState } from 'react';
import { Layout, Menu, Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { Link } from 'react-router-dom';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const MainLayout = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Task added successfully!');
        setIsModalVisible(false);
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

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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
        <Button className="floating-button" type="primary" onClick={showModal}>
          Add Task
        </Button>
        <Modal
          title="Add Task"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
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
      </Layout>
    </Layout>
  );
};

export default MainLayout;