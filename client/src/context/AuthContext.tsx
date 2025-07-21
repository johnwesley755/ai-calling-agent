import React, { createContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthState, User } from "../types";

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
  register: (token: string) => void;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: string }
  | { type: "REGISTER_SUCCESS"; payload: string }
  | { type: "LOGOUT" }
  | { type: "AUTH_ERROR"; payload: string };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload);
      try {
        const decoded = jwtDecode<{ user: User }>(action.payload);
        return {
          ...state,
          token: action.payload,
          isAuthenticated: true,
          loading: false,
          user: decoded.user,
          error: null,
        };
      } catch {
        return { ...state, error: "Invalid token" };
      }

    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };

    case "AUTH_ERROR":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      try {
        jwtDecode<{ user: User }>(state.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: state.token });
      } catch {
        dispatch({ type: "AUTH_ERROR", payload: "Invalid token" });
      }
    } else {
      dispatch({ type: "AUTH_ERROR", payload: "No token found" });
    }
  }, []);

  const login = (token: string) =>
    dispatch({ type: "LOGIN_SUCCESS", payload: token });
  const register = (token: string) =>
    dispatch({ type: "REGISTER_SUCCESS", payload: token });
  const logout = () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
