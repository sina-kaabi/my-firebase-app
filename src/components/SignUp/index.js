import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../Firebase/firebaseConfig";

import * as ROUTES from "../../routes";
import * as ROLES from "../../constants/roles";

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  isAdmin: false,
  error: null,
};

const SignUpForm = () => {
  const [formState, setFormState] = useState({ ...INITIAL_STATE });
  const { username, email, passwordOne, passwordTwo, isAdmin, error } =
    formState;
  const roles = {};
  if (isAdmin) {
    roles[ROLES.ADMIN] = ROLES.ADMIN;
  }
  const { firebase } = useFirebase();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (passwordOne !== passwordTwo) {
      setFormState((prevState) => ({
        ...prevState,
        error: {
          message: "Passwords do not match.",
        },
      }));
      return;
    }

    const additionalData = {
      username: username || "defaultUsername",
      roles: isAdmin ? { ADMIN: "ADMIN" } : {},
    };

    try {
      const authResult = await firebase.doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
        additionalData
      );
      console.log("User created and additional data saved.");

      // const userData = {
      //   username,
      //   email,
      //   roles,
      // };
      const authUser = authResult;
      console.log("user created and additional data saved.", authUser);
      // await firebase.setUserData(authUser.uid, userData);

      setFormState({ ...INITIAL_STATE });
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error during sign-up:", error);
      setFormState((prevState) => ({
        ...prevState,
        error,
      }));
    }
  };

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
      // [event.target.name]: event.target.value,
    }));
  };

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    username === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      ></input>

      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      ></input>

      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      ></input>
      <label>
        <input
          name="isAdmin"
          type="checkbox"
          checked={isAdmin}
          onChange={onChange}
        />
        Admin?
      </label>

      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

//  Functional wrapper to inject navigate

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;

export { SignUpLink, SignUpForm };
