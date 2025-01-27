import React from 'react';
import GamePage from './GamePage/GamePage';
import { GAME_URL } from './routes';

export interface IRoute {
  path: string;
  element: React.ReactElement;
  requireAuth?: boolean;
  requireUnauth?: boolean;
  // requiredPermission?: RolePermissionsEnum;
  withNavigation?: boolean;
  isCentered?: boolean;
  grayBg?: boolean;
}

export const routesArray: IRoute[] = [
  {
    path: '/',
    element: <></>,
    withNavigation: true,
  },
  {
    path: GAME_URL,
    element: <GamePage />,
    withNavigation: true,
  },
];
