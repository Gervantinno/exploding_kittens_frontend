import React from 'react';
import GamePage from './GamePage/GamePage';
import { CREATE_ROOM_URL, GAME_URL, ROOM_URL, ROOMS_URL } from './routes';
import RoomsPage from './RoomsPage/RoomsPage';
import CreateRoomPage from './CreateRoomPage/CreateRoomPage';
import { Navigate } from 'react-router-dom';
import RoomPage from './RoomPage/RoomPage';

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
    element: <Navigate to={ROOMS_URL} />,
    withNavigation: true,
  },
  {
    path: ROOMS_URL,
    element: <RoomsPage />,
    withNavigation: true,
  },
  {
    path: ROOM_URL,
    element: <RoomPage />,
    withNavigation: true,
  },
  {
    path: CREATE_ROOM_URL,
    element: <CreateRoomPage />,
    withNavigation: true,
  },
  {
    path: GAME_URL,
    element: <GamePage />,
    withNavigation: true,
  },
];
