import React, { FunctionComponent } from "react";
import { Route, Redirect, RouteProps, RouteComponentProps } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { keycloak, initialized } = useKeycloak();
  return (
    <Route
      {...rest}
      render={(props) =>
        initialized && keycloak.authenticated ? ( //put your authenticate logic here
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
