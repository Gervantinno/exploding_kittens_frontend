import { Route, Routes } from 'react-router';
import { routesArray, IRoute } from './routesArray';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import RequireAuth from './RequireAuth/RequireAuth';

const Routing = () => {
  return (
    <Routes>
      {routesArray.map((route: IRoute) => {
        let element = <ErrorBoundary>{route.element}</ErrorBoundary>;

        if (route.requireAuth) {
          element = (
            <RequireAuth to={route.path}>
              <div className={'page'}>{element}</div>
            </RequireAuth>
          );
        }

        return <Route key={route.path} path={route.path} element={element} />;
      })}
    </Routes>
  );
};

export default Routing;
