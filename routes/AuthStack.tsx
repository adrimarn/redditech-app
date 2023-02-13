import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignIn } from "../screens/Auth/SignIn";

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sign In Screen" component={SignIn} />
    </Stack.Navigator>
  );
};
