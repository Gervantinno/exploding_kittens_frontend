import React from 'react';
import { getUserName } from '../../shared/utils/userName';
import AuthPage from '../AuthPage/AuthPage';

type RequireAuthProps = {
  to: string;
};

const RequireAuth: React.FC<React.PropsWithChildren<RequireAuthProps>> = ({ to, children }) => {
  const username = getUserName();

  if (!username) {
    return <AuthPage />;
  }

  return children;
};

export default RequireAuth;
