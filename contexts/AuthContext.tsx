import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuthAccessTokenContent = {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
};

export const AuthContext = createContext<AuthAccessTokenContent>({
  accessToken: "",
  setAccessToken: () => {},
});

export const useAuthAccessToken = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) {
      loadAccessToken();
    }
  }, [accessToken]);

  async function loadAccessToken(): Promise<void> {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        setAccessToken(accessToken);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoaded(true);
    }
  }
  //TODO: Use sign in and sign out functions
  const signIn = async (accessToken: string) => {
    try {
      await AsyncStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      setAccessToken("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
