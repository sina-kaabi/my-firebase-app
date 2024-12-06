import React, { createContext, useContext } from "react";
import Firebase from "./firebaseConfig"

const FirebaseContext = createContext(null);

const useFirebase = () => {
  return useContext(FirebaseContext);
}

const FirebaseProvider = ({ children }) => {
  const firebase = new Firebase();

  return (
    <FirebaseContext.Provider value={{ firebase }}>
      {children}
    </FirebaseContext.Provider>
  );
};


export { FirebaseProvider, useFirebase };
export default FirebaseContext;
