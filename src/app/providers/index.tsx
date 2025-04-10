import React from 'react';
import RouterProvider from './RouterProvider';
import GoogleProvider from './GoogleProvider';

interface ProvidersProps {
  children?: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }: ProvidersProps) => {
  return (
    <GoogleProvider>
      <RouterProvider>{children}</RouterProvider>
    </GoogleProvider>
  );
};

export default Providers;
