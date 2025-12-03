import { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  apiChangePassword
} from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const res = await getMe()
        if (res?.data?.user) {
          setUser(res.data.user);
        } else if (res?.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // --- login ---
  async function login(email, password) {
    const res = await apiLogin(email, password);
if (res?.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error("Login failed");
  }

  // --- register ---
  async function register(username, email, password) {
    await apiRegister(username, email, password);
    const res = await apiLogin(email, password);
if (res?.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error("Registration succeeded but login failed");
  }

  // --- logout ---
  async function logout() {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
    }
  }

  // --- change password ---
 async function changePassword(currentPsw, newPassword) {
  try{
    return await apiChangePassword(currentPsw, newPassword)
  }catch (err) {
      console.error("Logout error", err);
    }
}

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
