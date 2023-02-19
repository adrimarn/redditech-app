import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuthAccessTokenContent = {
  accessToken: string;
  //setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  signIn: (accessToken: string) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthAccessTokenContent>({
  accessToken: "",
  //setAccessToken: () => {},
  signIn: () => {},
  signOut: () => {},
});

export const useAuthAccessToken = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) {
      loadAccessToken();
    }
  }, []);

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
  const signIn = useCallback(async (accessToken: string) => {
    try {
      await AsyncStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      setAccessToken("");
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
