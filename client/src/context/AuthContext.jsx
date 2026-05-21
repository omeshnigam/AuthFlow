import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, refreshSession, setAccessToken } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    refreshSession().then((session) => {
      if (!active) return;
      setUser(session?.user || null);
      setStatus("ready");
    });

    return () => {
      active = false;
    };
  }, []);

  const login = async (payload) => {
    const session = await api.login(payload);
    setAccessToken(session.accessToken);
    setUser(session.user);
    return session.user;
  };

  const signup = async (payload) => {
    const session = await api.signup(payload);
    setAccessToken(session.accessToken);
    setUser(session.user);
    return session.user;
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setAccessToken("");
      setUser(null);
    }
  };

  const updateProfile = async (payload) => {
    const data = await api.updateProfile(payload);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      updateProfile
    }),
    [user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
