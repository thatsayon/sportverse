// utils/decodeToken.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp?: number;
  iat?: number;
  [key: string]: any; // dynamic claims
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
