
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import SQLEditor from '@/components/SQLEditor';

const SQLPracticePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <SQLEditor />;
};

export default SQLPracticePage;
