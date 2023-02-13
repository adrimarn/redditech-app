import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useAuthAccessToken } from "../contexts/AuthContext";
// import {Loading} from '../components/Loading';

export const Router = () => {
  const { accessToken } = useAuthAccessToken();

  // TODO: Add loading screen
  // if (loading) {
  //     return <Loading />;
  // }
  return (
    <NavigationContainer>
      {accessToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
