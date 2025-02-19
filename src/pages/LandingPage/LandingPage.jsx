import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';
import './LandingPage.css';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <Title level={1} className="landing-title">Welcome to Task Manager</Title>
        <Paragraph className="landing-text">Manage your tasks efficiently and effectively.</Paragraph>
        <div className="button-container">
          <Link to="/login">
            <Button type="primary" size="large" className="landing-button">Login</Button>
          </Link>
          
          <Link to="/register">
          <Button type="primary" size="large" className="landing-button">Registro</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;