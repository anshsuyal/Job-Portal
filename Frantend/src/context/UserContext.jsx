import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";

export const UserDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [edit, setEdit] = useState(false); // ✅ moved inside component
  const { serverUrl } = useContext(authDataContext);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/currentuser`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("User data fetched:", result.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getPost = async() => {
    try {
      let result = await axios.get(serverUrl+"/api/post/getpost",{
        withCredentials:true
      })
      console.log(result);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    getCurrentUser();
    getPost()
  }, []);

  const value = { userData, setUserData, edit, setEdit };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
