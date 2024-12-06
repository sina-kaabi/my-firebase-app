import React, { useState, useEffect } from "react";

import AuthUserContext from "./context";
import { useFirebase } from "../Firebase/firebaseConfig";

const withAuthentication = (Component) => {
  const WithAuthentication = (props) => {
    const firebase = useFirebase();
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
      const unsubscribe = firebase.onAuthListener(
        (mergedAuthUser) => {
          setAuthUser(mergedAuthUser);
        },
        () => {
          setAuthUser(null);
        }
      );

      return () => {
        if (unsubscribe && typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    }, [firebase]);

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };

  return WithAuthentication;
};

export default withAuthentication;
