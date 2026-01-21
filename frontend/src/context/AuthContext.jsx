// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// const USERS_KEY = "authsphere_users";
// const CURRENT_USER_KEY = "authsphere_current_user";
// const ONLINE_TIMEOUT = 5 * 60 * 1000; // 5 minutes inactivity timeout

// const todayDate = () => new Date().toISOString().split("T")[0];

// const seedUsers = [
//   {
//     id: "1",
//     name: "Priyesh",
//     email: "user@authsphere.com",
//     role: "user",
//     loginHistory: [],
//     tasks: [],
//     isOnline: false,
//     lastActive: null,
//   },
//   {
//     id: "admin",
//     name: "Admin",
//     email: "admin@authsphere.com",
//     role: "admin",
//     loginHistory: [],
//     tasks: [],
//     isOnline: false,
//     lastActive: null,
//   },
// ];

// export function AuthProvider({ children }) {
//   const [users, setUsers] = useState([]);
//   const [user, setUser] = useState(null);

//   /* ---------- INIT ---------- */
//   useEffect(() => {
//     const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY));
//     const storedUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

//     if (!storedUsers) {
//       localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
//       setUsers(seedUsers);
//     } else {
//       setUsers(storedUsers);
//     }

//     if (storedUser) setUser(storedUser);
//   }, []);

//   /* ---------- PERSIST ---------- */
//   useEffect(() => {
//     localStorage.setItem(USERS_KEY, JSON.stringify(users));
//   }, [users]);

//   /* ---------- HEARTBEAT / INACTIVITY ---------- */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       const updatedUsers = users.map(u => {
//         if (!u.lastActive) return u;
//         return { ...u, isOnline: now - u.lastActive < ONLINE_TIMEOUT };
//       });
//       setUsers(updatedUsers);
//     }, 5000); // check every 5 seconds

//     return () => clearInterval(interval);
//   }, [users]);

//   const updateActivity = (userId) => {
//     const updatedUsers = users.map(u =>
//       u.id === userId ? { ...u, lastActive: Date.now(), isOnline: true } : u
//     );
//     setUsers(updatedUsers);

//     if (user && user.id === userId) {
//       setUser({ ...user, lastActive: Date.now(), isOnline: true });
//       localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...user, lastActive: Date.now(), isOnline: true }));
//     }

//     localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
//   };

//   /* ---------- AUTH ---------- */
//   const login = (email) => {
//     let allUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

//     let found = allUsers.find(u => u.email === email);

//     if (!found) {
//       found = {
//         id: Date.now().toString(),
//         name: email.split("@")[0],
//         email,
//         role: email.includes("admin") ? "admin" : "user",
//         loginHistory: [],
//         tasks: [],
//         isOnline: true,
//         lastActive: Date.now(),
//       };
//       allUsers.push(found);
//     }

//     const updatedUsers = allUsers.map(u =>
//       u.id === found.id
//         ? {
//             ...u,
//             loginHistory: [
//               ...u.loginHistory,
//               {
//                 date: todayDate(),
//                 loginTime: new Date().toLocaleTimeString(),
//                 logoutTime: null,
//               },
//             ],
//             isOnline: true,
//             lastActive: Date.now(),
//           }
//         : u
//     );

//     const updatedCurrentUser = updatedUsers.find(u => u.email === email);

//     setUsers(updatedUsers);
//     setUser(updatedCurrentUser);

//     localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
//     localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurrentUser));

//     return true;
//   };

//   const logout = () => {
//     if (!user) return;

//     const updatedUsers = users.map(u => {
//       if (u.id !== user.id) return u;

//       const history = [...u.loginHistory];
//       if (history.length > 0) history[history.length - 1].logoutTime = new Date().toLocaleTimeString();

//       return { ...u, loginHistory: history, isOnline: false, lastActive: null };
//     });

//     setUsers(updatedUsers);
//     setUser(null);

//     localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
//     localStorage.removeItem(CURRENT_USER_KEY);
//   };

//   /* ---------- TASKS ---------- */
//   const addTask = (text) => {
//     if (!user) return;

//     const updatedUsers = users.map(u =>
//       u.id === user.id
//         ? {
//             ...u,
//             tasks: [
//               ...u.tasks,
//               {
//                 id: Date.now().toString(),
//                 date: todayDate(),
//                 text,
//                 completed: false,
//               },
//             ],
//           }
//         : u
//     );

//     setUsers(updatedUsers);
//     localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
//     updateActivity(user.id); // mark user active when adding task
//   };

//   const toggleTask = (taskId) => {
//     const updatedUsers = users.map(u =>
//       u.id === user.id
//         ? {
//             ...u,
//             tasks: u.tasks.map(t =>
//               t.id === taskId ? { ...t, completed: !t.completed } : t
//             ),
//           }
//         : u
//     );

//     setUsers(updatedUsers);
//     localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
//     updateActivity(user.id); // mark user active
//   };

//   const getUserById = (id) => users.find(u => u.id === id);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         users,
//         login,
//         logout,
//         addTask,
//         toggleTask,
//         getUserById,
//         updateActivity,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


// this is s sgs ogdjgndjkn


// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/axios";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔄 Load user from localStorage on refresh
//   useEffect(() => {
//     const stored = localStorage.getItem("auth_user");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setUser(parsed.user);
//     }
//     setLoading(false);
//   }, []);

//   // 🔐 LOGIN (Backend)
//   const login = async (email, password) => {
//     const res = await api.post("/api/auth/login", {
//       email,
//       password,
//     });

//     const { token, user } = res.data;

//     localStorage.setItem(
//       "auth_user",
//       JSON.stringify({ token, user })
//     );

//     setUser(user);
//     return user;
//   };

//   // 📝 REGISTER (optional – already used in SignUp)
//   const register = async (data) => {
//     const res = await api.post("/api/auth/register", data);

//     const { token, user } = res.data;

//     localStorage.setItem(
//       "auth_user",
//       JSON.stringify({ token, user })
//     );

//     setUser(user);
//     return user;
//   };

//   // 🚪 LOGOUT
//   const logout = () => {
//     localStorage.removeItem("auth_user");
//     setUser(null);
//     window.location.href = "/";
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         register,
//         logout,
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState, useEffect } from "react";
// import { loginUser, logoutUser } from "../api/auth.api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("auth_user");
//     if (stored) {
//       const { user } = JSON.parse(stored);
//       setUser(user);
//     }
//   }, []);

//   // Login function
//   const login = async (email, password) => {
//     try {
//       const res = await loginUser({ email, password });
//       if (!res || !res.user) throw new Error("Invalid login response");

//       localStorage.setItem("auth_user", JSON.stringify(res));
//       setUser(res.user);

//       return res;
//     } catch (err) {
//       console.error("Login error:", err);
//       // Throw the actual backend message if available
//       throw new Error(err?.response?.data?.message || err.message || "Login failed");
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await logoutUser();
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//     localStorage.removeItem("auth_user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);







// import { createContext, useContext, useState, useEffect } from "react";
// import { loginUser, logoutUser } from "../api/auth.api";
// import api from "../api/axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Load user from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("auth_user");
//     if (stored) {
//       const { user, token } = JSON.parse(stored);
//       setUser(user);
//       api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }
//   }, []);

//   const login = async (email, password) => {
//     const res = await loginUser({ email, password });

//     if (!res || !res.user || !res.token) {
//       throw new Error("Invalid login response");
//     }

//     localStorage.setItem("auth_user", JSON.stringify(res));
//     setUser(res.user);

//     // Set token for future API requests
//     api.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
//   };

//   const logout = async () => {
//     await logoutUser();
//     localStorage.removeItem("auth_user");
//     setUser(null);
//     delete api.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);





import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth.api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored).user : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const { user } = JSON.parse(stored);
        setUser(user);
      } catch (err) {
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("auth_user", JSON.stringify(data));
    setUser(data.user);
    return data;
  };

  const register = async (credentials) => {
    const data = await registerUser(credentials);
    localStorage.setItem("auth_user", JSON.stringify(data));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
