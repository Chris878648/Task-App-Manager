import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { toast } from 'react-toastify';
import './LoginPage.css';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const data = await login(values.email, values.password);
      toast.success('Login successful!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('userId', data.userId);

      if (data.type === 1) {
        navigate('/dashboard');
      } else if (data.type === 2) {
        navigate('/admin');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Invalid username or password');
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para redirigir a la página principal
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
        <Title level={1} className="login-title">Login</Title>
        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Por favor ingresa tu email!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="login-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
