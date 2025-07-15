import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_TICKETS } from '../../lib/data';
import StatusBadge from '../shared/StatusBadge';

const TicketsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Ticket Queue
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Ticket</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Priority</th>
              <th scope="col" className="px-6 py-3">Equipment</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TICKETS.map(ticket => (
              <tr 
                key={ticket.id} 
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" 
                onClick={() => navigate(`/app/tickets/${ticket.id}`)}
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {ticket.title}
                </th>
                <td className="px-6 py-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={ticket.priority} />
                </td>
                <td className="px-6 py-4">{ticket.equipment}</td>
                <td className="px-6 py-4">{ticket.location}</td>
                <td className="px-6 py-4">{ticket.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsPage;