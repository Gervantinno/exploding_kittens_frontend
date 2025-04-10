import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface ProvidersProps {
  children: React.ReactNode;
}

const GoogleProvider: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="274103679822-lu710d83u75ovuh2rhcvlqqn3rqt5l85.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleProvider;
