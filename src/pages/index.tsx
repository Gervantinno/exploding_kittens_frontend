import { Route, Routes } from 'react-router';
import { routesArray, IRoute } from './routesArray';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

const Routing = () => {
  return (
    <Routes>
      {routesArray.map((route: IRoute) => {
        // Очень важен порядок в котором мы будем оборачивать компонент

        const element = <ErrorBoundary>{route.element}</ErrorBoundary>;

        // element = (
        //   <NavigationLayout
        //     withNavigation={route.withNavigation}
        //     isCentered={route.isCentered}
        //     grayBg={route.grayBg}
        //   >
        //     {element}
        //   </NavigationLayout>
        // );

        // if (route.requireAuth) {
        //   // if (route.requiredPermission) {
        //   //   element = (
        //   //     <RequirePermission requiredPermission={route.requiredPermission}>
        //   //       {element}
        //   //     </RequirePermission>
        //   //   );
        //   // }

        //   element = <RequireAuth>{element}</RequireAuth>;
        // } else if (route.requireUnauth) {
        //   element = <RequireUnauth>{element}</RequireUnauth>;
        // }

        return <Route key={route.path} path={route.path} element={element} />;
      })}
    </Routes>
  );
};

export default Routing;
