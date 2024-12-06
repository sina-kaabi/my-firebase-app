import React, { useEffect, useState } from "react";
import { useFirebase } from "./Firebase/firebaseConfig";
import PasswordChangeForm from "./PasswordChange";
import { WithAuthorization } from "./Session";

const Home = () => {
  const { firebase } = useFirebase();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    if (!firebase || !firebase.auth) {
      console.error("Firebase or Firebase Auth is not initialized.");
      return;
    }

    const listener = firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in:", user);
        setAuthUser(user);
      } else {
        console.log("User has been signed out.");
        setAuthUser(null);
      }
    });

    //cleanup the listener on unmount
    return () => listener();
  }, [firebase]);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>The Home Page is accessible by every signed in user.</p>
      {authUser ? (
        <>
          {" "}
          <p>Welcome, {authUser.email}!</p>
          {/* Pass the authUser as a prop to PasswordChangeForm */}
          <PasswordChangeForm authUser={authUser} />
        </>
      ) : (
        <p>Please sign in to access homepage.</p>
      )}
    </div>
  );
};

const condition = (authUser) => !!authUser;

export default WithAuthorization(condition)(Home);
