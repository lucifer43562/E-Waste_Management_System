
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from '../components/AuthPage';
import CustomerDashboard from '../components/CustomerDashboard';
import CompanyDashboard from '../components/CompanyDashboard';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  if (user.role === 'customer') {
    return <CustomerDashboard />;
  }

  if (user.role === 'company') {
    return <CompanyDashboard />;
  }

  return <AuthPage />;
};

export default Index;
