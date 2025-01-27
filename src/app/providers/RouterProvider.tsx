import React from 'react';
import { BrowserRouter } from 'react-router-dom';

interface RouterConfigProps {
  children: React.ReactNode;
}

const RouterProvider: React.FC<RouterConfigProps> = ({ children }: RouterConfigProps) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default RouterProvider;
