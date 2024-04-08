import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContax = createContext();
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();

      setUser(accountDetails);
      console.log("accoundetails:", accountDetails);
    } catch (error) {
      console.info(error);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();
    try {
      const responce = await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );

      const accountDetails = account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  const handleUserLogout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };
  const handleUserRegister = async (e, credential) => {
    e.preventDefault();
    if (credential.password !== credential.password2) {
      alert("password do not match");
      return
    }
      try {
        let responce = await account.create(
          ID.unique(),
          credential.email,
          credential.password,
          credential.name
        );
        await account.createEmailPasswordSession(credential.email , credential.password)
        const accountDetails = await account.get();
        setUser(accountDetails);
        console.log("accoundetails:", accountDetails);
        console.log("REGISTERED", responce);
        navigate('/')
      } catch (error) {
        console.error(error);
      }
  };
  const contexData = {
    user, 
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  };

  return (
    <AuthContax.Provider value={contexData}>
      {loading ? <p> ....Loading </p> : children}
    </AuthContax.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContax);
};
export default AuthContax;
