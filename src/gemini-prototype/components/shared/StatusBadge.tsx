import React from 'react';

type StatusType = 
  | 'Online' | 'Warning' | 'Error' 
  | 'Open' | 'In Progress' | 'Closed'
  | 'High' | 'Medium' | 'Low';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<StatusType, string> = {
    // Equipment statuses
    'Online': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Warning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Error': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    
    // Ticket statuses
    'Open': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Closed': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    
    // Priority levels
    'High': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      statusStyles[status] || 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }`}>
      {status}
    </span>
  );
};

export default StatusBadge;