import React, { useState, useEffect } from "react";
import { WithAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import fetchUsers from "../Firebase/firebaseConfig";
const AdminPage = ({ firebase, authUser }) => {
  console.log("Current authUser:", authUser);
  console.log("User roles:", authUser?.roles);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersObject = await firebase.getAllUsers();
        
        if (usersObject) {
          const usersList = Object.keys(usersObject).map((key) => ({
            uid: key,
            ...usersObject[key],
          }));
          setUsers(usersList);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [firebase]);

  const makeUserAdmin = async (userId) => {
    try {
      await firebase.makeUserAdmin(userId);
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error("Error making user admin:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Current Admin: {authUser.email}</p>
      
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  {user.roles ? 
                    Object.entries(user.roles)
                      .filter(([_, value]) => value)
                      .map(([role]) => role)
                      .join(', ') 
                    : 'No roles'}
                </td>
                <td>
                  <button onClick={() => makeUserAdmin(user.uid)}>
                    Make Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Condition check for admin role remains the same
const condition = (authUser) => authUser && authUser.roles[ROLES.ADMIN];

export default WithAuthorization(condition)(AdminPage);
