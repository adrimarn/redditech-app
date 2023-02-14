import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Subreddits } from "../screens/Subreddits";

const Tab = createBottomTabNavigator();

export const AppStack = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={Subreddits} />
    </Tab.Navigator>
  );
};
