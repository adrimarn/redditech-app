import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { Layout, Spinner } from "@ui-kitten/components";

export const Router = () => {
  const { accessToken, loading } = useAuthAccessToken();

  if (loading) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Spinner />
      </Layout>
    );
  }
  return (
    <NavigationContainer>
      {accessToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
