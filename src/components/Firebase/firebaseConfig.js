import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";
import { createContext, useContext } from "react";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpDNgOODOE7hnJ5ChjYLMwOKZHL2u9SI0",
  authDomain: "myproject-6f2f1.firebaseapp.com",
  projectId: "myproject-6f2f1",
  storageBucket: "myproject-6f2f1.appspot.com",
  messagingSenderId: "641707339102",
  appId: "1:641707339102:web:7905c84514b3a16bb0b3cf",
};

// Create FirebaseContext
const FirebaseContext = createContext(null);

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);

    this.auth = getAuth(this.app);
    this.db = getDatabase(this.app);

    this.googleProvider = new GoogleAuthProvider();

    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set to LOCAL.");
      })
      .catch((error) => {
        console.log("Error setting persistence:", error);
      });
  }

  getCurrentUser = () => {
    return this.auth.currentUser;
  };

  // Auth Api

  doCreateUserWithEmailAndPassword = (email, password, additionalData) => {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((authResult) => {
        const authUser = authResult.user;
        console.log("User created successfully:", authUser);

        return this.handleNewUser(authUser, additionalData).then(
          () => authUser
        );
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        throw error;
      });
  };

  doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(this.auth, email, password);
  };

  doSignInWithGoogle = () => {
    return signInWithPopup(this.auth, this.googleProvider);
  };

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => {
    return sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log("password reset email sent succesfully");
      })
      .catch((error) => {
        throw error;
      });
  };

  doPasswordUpdate = (password) => {
    const currentUser = this.auth.currentUser;
    console.log("Current User (doPasswordUpdate):", currentUser);

    if (currentUser && typeof currentUser.updatePassword === "function") {
      return currentUser.updatePassword(password);
    }
    return Promise.reject(
      "No user is currently signed in or unable to update the password."
    );
  };

  // *** User API ***

  user = (uid) => ref(this.db, `users/${uid}`);

  // const handleNewUser = (authUser) => {
  //   const {uid, email } = authUser;
  // }

  setUserData = async (uid, data) => {
    //return set(ref(this.db, `users/${uid}`), data);
    try {
      await set(this.user(uid), data);
      console.log(`User ${uid} data updated successfully.`);
    } catch (error) {
      console.error(`Failed to set user data for ${uid}:`, error);
      throw error;
    }
  };

  getUserData = async (uid) => {
    try {
      const snapshot = await get(this.user(uid)); // get user data
      return snapshot;
    } catch (error) {
      console.error(`Failed to get user data for ${uid}:`, error);
      throw error;
    }

    //get(ref(this.db, `users/${uid}`));
  };

  updateUserData = (uid, data) => {
    return update(this.user(uid), data);
    //update(ref(this.db, `users/${uid}`), data);
  };

  deleteUserData = (uid) => {
    return remove(this.user(uid));
    // remove(ref(this.db, `users/${uid}`));
  };

  getAllUsers = async () => {
    try {
      // First, check if the current user is an admin
      const currentUser = await this.getCurrentUser(); // You might already have this method
      console.log("Current User:", currentUser);

      if (!currentUser || !currentUser.roles || !currentUser.roles.ADMIN) {
        throw new Error("Access denied. User is not an admin.");
      }

      // Now fetch all users from the database
      const snapshot = await get(ref(this.db, "users")); // Fetch all users
      if (snapshot.exists()) {
        return snapshot.val(); // Return all user data
      } else {
        console.warn("No users found in the database.");
        return null; // Return null if no users exist
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error; // Throw the error to handle it where this method is called
    }
  };

  handleNewUser = (authUser, additionalData = {}) => {
    const { uid, email } = authUser;
    const { username = "defaultUsername", roles = {} } = additionalData;

    const sanitizedRoles = {
      ...roles,
      ADMIN: !!roles.ADMIN,
    };

    return this.setUserData(uid, {
      email: email,
      username: username || "defaultUsername",

      roles: sanitizedRoles,
    })
      .then(() => {
        console.log("User data saved successfully.");
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
        throw error;
      });
  };
  // *** Auth User Listener ***
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.getUserData(authUser.uid)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const dbUser = snapshot.val();

              // default empty roles
              if (!dbUser.roles) {
                dbUser.roles = {};
              }

              // merge auth and db user
              const mergedAuthUser = {
                uid: authUser.uid,
                email: authUser.email,
                ...dbUser,
              };

              next(mergedAuthUser);
            } else {
              console.error("No user found in the database.");
              fallback();
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            fallback();
          });
      } else {
        fallback();
      }
    });

  makeUserAdmin = async (uid) => {
    try {
      await this.updateUserData(uid, {
        roles: {
          ADMIN: true
        }
      });
      console.log("Successfully made user an admin");
    } catch (error) {
      console.error("Error making user admin:", error);
      throw error;
    }
  };
}

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [firebaseInstance] = useState(() => new Firebase());

  useEffect(() => {
    const unsubscribe = firebaseInstance.onAuthUserListener(
      (mergedUser) => {
        console.log("Merged User:", mergedUser);
        setAuthUser(mergedUser);
      },
      () => {
        console.log("User signed out or no user found.");
        setAuthUser(null);
      }
    );
    return () => unsubscribe();
  }, [firebaseInstance]);

  return (
    <FirebaseContext.Provider value={{ authUser, firebase: firebaseInstance }}>
      {children}
    </FirebaseContext.Provider>
  );
};
// Higher-order component to provide Firebase instance

export { FirebaseContext };
export default Firebase;
