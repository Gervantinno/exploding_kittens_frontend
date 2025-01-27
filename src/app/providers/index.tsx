import React from 'react';
import RouterProvider from './RouterProvider';

interface ProvidersProps {
  children?: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }: ProvidersProps) => {
  return <RouterProvider>{children}</RouterProvider>;
};

export default Providers;
