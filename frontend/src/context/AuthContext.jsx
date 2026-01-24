import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user from localStorage on app start
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("auth_user"));
      if (stored?.user && stored?.token) {
        setUser(stored.user);
      }
    } catch (error) {
      console.error("Invalid auth_user in storage, clearing...");
      localStorage.removeItem("auth_user");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 LOGIN
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response");
    }

    const authPayload = {
      success: true,
      user: data.user,
      token: data.token,
    };

    localStorage.setItem("auth_user", JSON.stringify(authPayload));
    setUser(data.user);

    return authPayload;
  };

  // 📝 REGISTER
  const register = async (credentials) => {
    const data = await registerUser(credentials);

    const authPayload = {
      success: true,
      user: data.user,
      token: data.token || null, // token exists only if auto-login enabled
    };

    localStorage.setItem("auth_user", JSON.stringify(authPayload));
    setUser(data.user);

    return authPayload;
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🎯 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
