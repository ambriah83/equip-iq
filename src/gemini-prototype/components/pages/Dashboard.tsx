import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_TICKETS } from '../../lib/data';
import StatusBadge from '../shared/StatusBadge';
import SkeletonLoader from '../shared/SkeletonLoader';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const stats = [
    { title: 'Assets Requiring Attention', value: '1' },
    { title: 'Tickets Unassigned > 24hrs', value: '0' },
    { title: 'Assets with Highest Failure Rate', value: 'KBL Megasun 6800' },
    { title: 'Warranty Expirations This Month', value: '2' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard: React.FC<{ title: string; value: string; isLoading: boolean }> = ({ 
    title, 
    value, 
    isLoading 
  }) => {
    if (isLoading) return <SkeletonLoader className="h-28" />;
    
    return (
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow" 
        onClick={() => navigate('/app/tickets')}
      >
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{value}</p>
      </div>
    );
  };

  const RecentActivityList: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    if (isLoading) return <SkeletonLoader className="h-48" />;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {MOCK_TICKETS.slice(0, 3).map(ticket => (
            <li 
              key={ticket.id} 
              className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" 
              onClick={() => navigate(`/app/tickets/${ticket.id}`)}
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{ticket.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {ticket.equipment} at {ticket.location}
                </p>
              </div>
              <StatusBadge status={ticket.status} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome, {user?.name}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Here's a snapshot of your franchise operations.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <StatCard 
            key={stat.title} 
            title={stat.title} 
            value={stat.value} 
            isLoading={loading} 
          />
        ))}
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h2>
      <RecentActivityList isLoading={loading} />
    </div>
  );
};

export default DashboardPage;