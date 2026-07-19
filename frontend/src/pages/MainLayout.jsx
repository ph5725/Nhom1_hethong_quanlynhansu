import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const MainLayout = () => {
  return (
    <div className="dashboard d-flex">
      <Sidebar />
      <div className="dashboard-content flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;