import React, { useEffect } from "react";
import { Layout, Text } from "@ui-kitten/components";
import { ApiService, UserDataType } from "../services/apiService";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { Button } from "react-native";

export const HomeScreen = () => {
  const { accessToken, signOut } = useAuthAccessToken();
  const [userData, setUserData] = React.useState<UserDataType>();
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      ApiService.getUser(accessToken).then((res) => {
        setUserData(res);
        setLoading(false);
      });
    }
  }, [accessToken]);

  const Welcome = () => {
    if (userData) return <Text category="h1">Welcome {userData.name}!</Text>;
    else return <Text category="h1">Welcome!</Text>;
  };
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <Text category="h1">Loading...</Text>
      ) : (
        <>
          <Welcome />
          <Text>You are successfully logged in!</Text>
          <Button title={"Logout"} onPress={signOut} />
        </>
      )}
    </Layout>
  );
};
