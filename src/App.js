import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
//import SignIn from "./components/SignIn";
//import Home from "./components/Home";

import SignUpPage from "./components/SignUp";
import SignInPage from "./components/SignIn";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import PasswordForgetPage from "./components/PasswordForget";
import AccountPage from "./components/Account";
import AdminPage from "./components/Admin";
import SecondaryPage from "./components/Secondary_Page";
import withNonAdminAuthorization from "./components/Session/withUserAuthorization";
import * as ROUTES from "./routes";
import {
  FirebaseProvider,
  useFirebase,
} from "./components/Firebase/firebaseConfig";

//import Navigation from "./components/Navigation";
//import { withAuthentication } from "./components/Session";
//import { AuthUserContext } from "./components/Session/context";

const App = () => {
  return (
    <FirebaseProvider>
      <Router>
        <div>
          <RoutesComponent />
        </div>
      </Router>
    </FirebaseProvider>
  );
};

const RoutesComponent = () => {
  const { authUser, firebase } = useFirebase();
  console.log("authUser:", authUser);

  if (!firebase) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navigation authUser={authUser} />
      <hr />
      {authUser ? (
        <p>Welcome back, {authUser.email}!</p>
      ) : (
        <p>Please sign in.</p>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
        <Route path={ROUTES.PASSWORD_FORGET} element={<PasswordForgetPage />} />
        <Route
          path={ROUTES.HOME}
          element={authUser ? <Home /> : <Navigate to={ROUTES.SIGN_IN} />}
        />
        <Route
          path={ROUTES.ACCOUNT}
          element={
            authUser ? <AccountPage /> : <Navigate to={ROUTES.SIGN_IN} />
          }
        />

        <Route
          path={ROUTES.ADMIN}
          element={
            authUser?.roles?.ADMIN === true ? (
              <AdminPage firebase={firebase} authUser={authUser} />
            ) : (
              <Navigate to={ROUTES.SIGN_IN} />
            )
          }
        />
        <Route
          path={ROUTES.SECONDARY_PAGE}
          element={
            authUser ? (
              withNonAdminAuthorization(SecondaryPage)
            ) : (
              <Navigate to={ROUTES.SIGN_IN} />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
