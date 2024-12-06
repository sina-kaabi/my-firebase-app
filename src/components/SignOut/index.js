import React from "react";
import { useFirebase } from "../Firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import * as ROUTES from "../../routes";

const SignOutButton = () => {
  const { firebase } = useFirebase();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await firebase.doSignOut();
      navigate(ROUTES.SIGN_IN); // Redirect to Sign In page after sign out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <button type="button" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
