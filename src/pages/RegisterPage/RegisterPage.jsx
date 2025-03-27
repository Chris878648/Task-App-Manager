import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../LoginPage/LoginPage.css';
import {register} from '../../services/authService';
import { toast } from 'react-toastify';


const { Title } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
  
    try {
      const data = await register(values.username, values.email, values.password);
      message.success('Registration successful!');
      toast.success('Registration successful!');

      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error("Username or Email are already in use, choose another.");
        toast.error("Username or Email are already in use, choose another.");
      } else {
        message.error(`Registration failed: ${error.message}`);
        toast.error(`Registration failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };


  return (
    <div className="login-container">

{}
      <Button
        type="default" 
        onClick={handleGoHome} 
        style={{
          position: 'absolute', 
          top: '24px', 
          left: '24px', 
        }}
      >
        Volver
      </Button>

      <div className="login-content">
        <Title level={1} className="login-title">Register</Title>
        <Form name="register" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="login-button">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
