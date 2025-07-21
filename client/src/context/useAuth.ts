// useAuth.ts
import { useContext } from "react";
import { AuthContext } from './AuthContext.tsx';

export const useAuth = () => useContext(AuthContext);
