import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Feed } from "../screens/Feed";
import Profile from "../screens/Profile";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";
import { RenderProp } from "@ui-kitten/components/devsupport";
import { ImageProps } from "react-native";

const Tab = createBottomTabNavigator();

const HomeIcon: RenderProp<Partial<ImageProps>> = (props) => (
  <Icon {...props} name="home-outline" />
);

const FeedIcon: RenderProp<Partial<ImageProps>> = (props) => (
  <Icon {...props} name="compass-outline" />
);

const UserIcon: RenderProp<Partial<ImageProps>> = (props) => (
  <Icon {...props} name="person-outline" />
);

export const AppStack = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Feed" component={Feed} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);

const BottomTabBar: React.FC<BottomTabBarProps> = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab icon={HomeIcon} />
    <BottomNavigationTab icon={FeedIcon} />
    <BottomNavigationTab icon={UserIcon} />
  </BottomNavigation>
);
