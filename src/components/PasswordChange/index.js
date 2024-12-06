import React, { useState } from "react";

import { useFirebase } from "../Firebase/firebaseConfig";
//import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null,
  success: null,
};

const PasswordChangeForm = () => {
  const [formState, setFormState] = useState({ ...INITIAL_STATE });
  const { passwordOne, passwordTwo, error, success } = formState;
  const { authUser, firebase } = useFirebase();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!authUser) {
      setFormState((prevState) => ({
        ...prevState,
        error: { message: "No user is currently signed in." },
        success: null,
      }));
      return;
    }

    //check if passwords match
    if (passwordOne !== passwordTwo) {
      setFormState((prevState) => ({
        ...prevState,
        error: { message: "Passwords do not match." },
        success: null,
      }));
      return;
    }

    try {
      await firebase.doPasswordUpdate(passwordOne);
      setFormState({
        ...INITIAL_STATE,
        success: "Password has been changed successfully!",
      });
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setFormState((prevState) => ({
          ...prevState,
          error: { message: "Please sign in again to update your password." },
        }));
        // Optionally, redirect to the sign-in page or show a modal to prompt reauthentication
        // e.g., navigate("/signin");
        return; // Exit early to avoid further processing
      }
      console.error("Error updating password:", error);
      setFormState((prevState) => ({
        ...prevState,
        error: {
          message: error.message || "An error occured during password update.",
        },
        success: null,
      }));
    }
  };

  const onChange = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="New Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm New Password"
      />
      <button disabled={isInvalid} type="submit">
        Change Password
      </button>

      {error && <p style={{ color: "red" }}>{error.message}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default PasswordChangeForm;
