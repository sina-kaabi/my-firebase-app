import React from "react";
import { Navigate } from "react-router-dom";
import { useFirebase } from "../Firebase";
import * as ROUTES from "../../routes";
import * as ROLES from "../../constants/roles";

const withNonAdminAuthorization = (Component) => {
  return (props) => {
    const { authUser } = useFirebase();

    if (!authUser || authUser.roles[ROLES.ADMIN]) {
      return <Navigate to={ROUTES.HOME} replace />;
    }

    return <Component {...props} />;
  };
};

export default withNonAdminAuthorization;
