import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../Firebase/firebaseConfig";
import * as ROUTES from "../../routes";

//import AuthUserContext from "./context";

const WithAuthorization = (condition) => (Component) => {
  const WithAuthorizationComponent = (props) => {
    const { firebase } = useFirebase();
    const navigate = useNavigate();
    const [mergedAuthUser, setMergedAuthUser] = useState(null);

    useEffect(() => {
      // Set up the onAuthUserListener
      const listener = firebase.onAuthUserListener(
        async (authUser) => {
          if (authUser) {
            try {
              const snapshot = await firebase.getUserData(authUser.uid);

              if (snapshot.exists()) {
                const dbUser = snapshot.val();

                if (!dbUser.roles) {
                  dbUser.roles = {};
                }

                const completeUser = {
                  uid: authUser.uid,
                  email: authUser.email,
                  ...dbUser,
                };

                setMergedAuthUser(completeUser);

                if (!condition(completeUser)) {
                  navigate(ROUTES.SIGN_IN);
                }
              } else {
                console.error("No database user found for this UID.");
                navigate(ROUTES.SIGN_IN);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              navigate(ROUTES.SIGN_IN);
            }
          } else {
            console.error("User is not authenticated.");
            navigate(ROUTES.SIGN_IN);
          }
        },
        () => {
          console.error("Auth Listener fallback triggered.");
          navigate(ROUTES.SIGN_IN);
        }
      );

      return () => listener && listener();
    }, [firebase, navigate]);

    return mergedAuthUser && condition(mergedAuthUser) ? (
      <Component {...props} />
    ) : null;
  };
  return WithAuthorizationComponent;
};

export default WithAuthorization;
