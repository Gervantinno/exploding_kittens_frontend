import React from 'react';
import GamePage from './GamePage/GamePage';
import { GAME_URL, ROOM_URL, ROOMS_URL, AUTH_URL } from './routes';
import RoomsPage from './RoomsPage/RoomsPage';
import { Navigate } from 'react-router-dom';
import RoomPage from './RoomPage/RoomPage';
import AuthPage from './AuthPage/AuthPage';

export interface IRoute {
  path: string;
  element: React.ReactElement;
  requireAuth?: boolean;
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
    requireAuth: true,
  },
  {
    path: ROOM_URL,
    element: <RoomPage />,
    withNavigation: true,
    requireAuth: true,
  },
  {
    path: GAME_URL,
    element: <GamePage />,
    withNavigation: true,
    requireAuth: true,
  },
  {
    path: AUTH_URL,
    element: <AuthPage />,
    withNavigation: true,
    requireAuth: false,
  },
];
