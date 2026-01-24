import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    // Requirement: Always start fresh (logged out) on application load/refresh
    AuthService.logout();
    setCurrentUser(undefined);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await AuthService.login(username, password);
      setCurrentUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (token) => {
    try {
      const data = await AuthService.googleLogin(token);
      setCurrentUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  const register = async (
    username,
    email,
    password,
    role,
    captchaId,
    captchaAnswer,
    assignedArea,
    fullName,
    phoneNumber,
    address,
  ) => {
    return AuthService.register(
      username,
      email,
      password,
      role,
      captchaId,
      captchaAnswer,
      assignedArea,
      fullName,
      phoneNumber,
      address,
    );
  };

  const getCaptcha = () => {
    return AuthService.getCaptcha();
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, register, googleLogin, getCaptcha }}
    >
      {children}
    </AuthContext.Provider>
  );
};
