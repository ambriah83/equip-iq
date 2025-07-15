import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-black font-sans">
      <Sidebar />
      <main className="flex-grow h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;