import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { RenderProp } from "@ui-kitten/components/devsupport";
import { ImageProps } from "react-native";

import { Feather } from "@expo/vector-icons";
import ModalProvider from "../contexts/ModalContext";
import { createStackNavigator } from "@react-navigation/stack";
import Posts from "../screens/Posts";
import Discover from "../screens/Discover";
import Profile from "../screens/Profile";
import Search from "../screens/Search";
import Post from "../screens/Post";

const Tab = createBottomTabNavigator();

const HomeIcon: RenderProp<Partial<ImageProps>> = (props) => (
  <Feather {...props} name="home" size={24} color="#ff4500" />
);

const FeedIcon: RenderProp<Partial<ImageProps>> = (props) => (
  <Feather {...props} name="compass" size={24} color="#ff4500" />
);

const UserIcon: RenderProp<Partial<ImageProps>> = (props) => (
  <Feather {...props} name="user" size={24} color="#ff4500" />
);

const SearchIcon: RenderProp<Partial<ImageProps>> = (props) => (
  <Feather {...props} name="search" size={24} color="#ff4500" />
);

// const PostsIcon: RenderProp<Partial<ImageProps>> = (props) => (
//   <Icon {...props} name="message-square-outline" />
// );

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Post"
        component={Post}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export const AppStack = () => (
  <ModalProvider>
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
      <Tab.Screen name="Feed" component={Discover} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Posts" component={Posts} />
    </Tab.Navigator>
  </ModalProvider>
);

const BottomTabBar: React.FC<BottomTabBarProps> = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab icon={HomeIcon} />
    <BottomNavigationTab icon={FeedIcon} />
    <BottomNavigationTab icon={UserIcon} />
    <BottomNavigationTab icon={SearchIcon} />
  </BottomNavigation>
);
