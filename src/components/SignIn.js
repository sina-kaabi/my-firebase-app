import React, { useState } from "react";
//import { auth, provider, signInWithPopup } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { SignUpLink } from "./SignUp";
import { useFirebase } from "./Firebase/firebaseConfig";
import * as ROUTES from "../routes";
import "./SignIn.css";
import { PasswordForgetLink } from "./PasswordForget";
import { browserLocalPersistence, setPersistence } from "firebase/auth";

// const SignIn = () => {
//   const navigate = useNavigate();
//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       console.log("User:", result.user);

//       navigate("/home");
//     } catch (error) {
//       console.error("Error during sign in:", error);
//     }
//   };

const SignInPage = () => (
  <div>
    <h1>Sign In</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

const SignInForm = () => {
  const [formState, setFormState] = useState({ ...INITIAL_STATE });
  const { email, password, error } = formState;
  const { firebase } = useFirebase();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await setPersistence(firebase.auth, browserLocalPersistence);
      await firebase.doSignInWithEmailAndPassword(email, password);

      console.log("User signed in:");
      setFormState({ ...INITIAL_STATE });
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Sign in error:", error);
      setFormState((prevState) => ({
        ...prevState,
        error,
      }));
    }
  };

  const onChange = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  const isInvalid = password === "" || email === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

//   return (
//     <div className="signin-container">
//       <button className="google-signin-btn" onClick={handleGoogleSignIn}>
//         Sign in with Google
//       </button>
//     </div>
//   );
// };

export default SignInPage;

export { SignInForm };
