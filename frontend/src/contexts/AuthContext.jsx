import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("chatUsername");

    if (token && username) {
      setUser({ token, username });
    }
  }, []);

  const login = (token, username) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("chatUsername", username);
    setUser({ token, username });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("chatUsername");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
