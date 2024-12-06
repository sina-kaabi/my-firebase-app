import React, { useState } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../../routes";
import { useFirebase } from "../Firebase/firebaseConfig";

const PasswordForgetPage = () => (
  <div>
    <h1>Password Forget</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  error: null,
};

const PasswordForgetForm = () => {
  const [formState, setFormState] = useState({ ...INITIAL_STATE });
  const { email, error } = formState;
  const { firebase } = useFirebase();

  const onSubmit = (event) => {
    event.preventDefault();

    firebase
      .doPasswordReset(email)
      .then(() => {
        setFormState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        console.error("Password reset error", error);
        setFormState((prevState) => ({ ...prevState, error }));
      });
  };

  const onChange = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const isInvalid = email === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
