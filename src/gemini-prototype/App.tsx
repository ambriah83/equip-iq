import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoaderCircle } from './lib/icons';

// Layout Components
import AppLayout from './components/layout/AppLayout';

// Page Components
import LandingPage from './components/pages/Landing';
import AuthPage from './components/pages/Auth';
import DashboardPage from './components/pages/Dashboard';
import EquipmentPage from './components/pages/Equipment';
import LocationsPage from './components/pages/Locations';
import TicketsPage from './components/pages/Tickets';
import AIChatPage from './components/pages/AIChat';
import SettingsPage from './components/pages/Settings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="equipment" element={<EquipmentPage />} />
        <Route path="equipment/:id" element={<div>Equipment Detail Page (TODO)</div>} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/:id" element={<div>Ticket Detail Page (TODO)</div>} />
        <Route path="ai" element={<AIChatPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}