import React, { useEffect } from "react";
import { useFirebase } from "../Firebase/firebaseConfig";
import { PasswordForgetForm } from "../PasswordForget";
import { WithAuthorization } from "../Session";

const AccountPage = () => {
  const { authUser, firebase } = useFirebase();

  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged((user) => {
      console.log("Auth State Changed:", user);
    });

    // Clean up the listener when the component unmounts
    return () => {
      if (listener && typeof listener === "function") {
        listener();
      }
    };
  }, [firebase]);

  return (
    <div>
      <h1>Account Page: {authUser?.email}</h1>

      <PasswordForgetForm />
    </div>
  );
};

const condition = (authUser) => !!authUser;

export default WithAuthorization(condition)(AccountPage);
