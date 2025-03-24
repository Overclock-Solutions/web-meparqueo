import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth/authStore';
import { Role } from '../store/models';
import { Center, Loader } from '@mantine/core';

interface ProtectedRouteProps {
  redirectPath?: string;
  allowedRoles: Role[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/',
  allowedRoles,
  children,
}) => {
  const { isAuthenticated, isLoading, user, getMe } = useAuthStore();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') && !user) {
      getMe().finally(() => {
        setIsFetched(true);
      });
    } else {
      setIsFetched(true);
    }
  }, [user, getMe]);

  if (isLoading || !isFetched) {
    return (
      <Center pt={20}>
        <Loader />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
