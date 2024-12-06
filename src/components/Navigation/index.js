import React from "react";
import { Link } from "react-router-dom";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../routes";
//import * as ROLES from "../../constants/roles";
//import { AuthUserContext } from "../Session";

const Navigation = ({ authUser }) => {
  console.log("authUser:", authUser);

  // Access the authUser directly from the context

  return (
    <>
      {authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )}
    </>
  );
};

const NavigationAuth = ({ authUser }) => {
  const isAdmin =
    authUser?.roles?.ADMIN === "ADMIN" || authUser?.roles?.ADMIN === true;

  return (
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      {!isAdmin && (
        <li>
          <Link to={ROUTES.SECONDARY_PAGE}>User</Link>
        </li>
      )}
      {isAdmin && (
        <li>
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </li>
      )}

      <li>
        <SignOutButton />
      </li>
    </ul>
  );
};

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
