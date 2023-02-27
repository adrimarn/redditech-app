import React, { useEffect, useState } from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import {
  ApiService,
  UserDataType,
  UserPreferencesDataType,
} from "../services/apiService";
import { Image, StyleSheet, View, Modal, Button as NButton } from "react-native";
import {
  Layout,
  Text,
  Divider,
  useTheme,
  Button,
  Input,
  Toggle,
  Card,
  List,
  ListItem,
  RadioGroup,
  Radio,
  Select,
} from "@ui-kitten/components";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const UserProfile = () => {
  const { accessToken, signOut } = useAuthAccessToken();
  const [userData, setUserData] = React.useState<UserDataType>();
  const [userPreferencesData, setUserPreferencesData] =
    React.useState<UserPreferencesDataType>({
      accept_pms: "",
      email_messages: false,
      activity_relevant_ads: false,
      nightmode: false,
      mark_messages_read: false,
      highlight_controversial: false,
    });
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme["color-basic-900"],
      padding: 20,
    },
    avatar: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    name: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme["text-basic-color"],
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      color: theme["text-hint-color"],
      lineHeight: 24,
      textAlign: "center",
    },
    divider: {
      backgroundColor: theme["border-basic-color-3"],
      marginVertical: 10,
    },
    editButton: {
      marginTop: 20,
      width: "50%",
    },
    okButton: {
      top: "90%",
      left: "29%",
      width: "50%",
      position: "absolute",
    },
    preferenceStyle: {
      marginBottom: "8%",
      marginTop: "20%",
      left: "29%",
    },
    radioButtons: {
      left:"350%",
    }
  });

  React.useEffect(() => {
    async function fetchUserData() {
      const res = await ApiService.getUser(accessToken);
      setUserData(res);
    }
    async function fetchUserPreferencesData() {
      const res = await ApiService.getUserPreferences(accessToken);
      setUserPreferencesData(res);
    }
    fetchUserData();
    fetchUserPreferencesData();
  }, []);

  const [modalVisible, setModalVisible] = React.useState(false);

  const handlePreferenceChange = (
    preferenceName: keyof UserPreferencesDataType,
    value: boolean | string | undefined
  ) => {
    setUserPreferencesData({
      ...userPreferencesData,
      [preferenceName]: value,
    });
    setTimeout(() => {
      ApiService.updateUserPreferences(accessToken, userPreferencesData);
    }, 1000);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSave = () => {
    if (userPreferencesData)
      ApiService.updateUserPreferences(accessToken, userPreferencesData);
    toggleModal();
  };

  const options = [
    { label: 'Everyone', value: "everyone" },
    { label: 'Whitelisted', value: "whitelisted" },
  ];

  return (
    <Layout style={styles.container}>
      {userData && (
        <>
          <Image source={{ uri: userData.icon_img }} style={styles.avatar} />
          <Text style={styles.name}>{userData.name}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.description}>
            {userData.subreddit.public_description}
          </Text>
          <NButton title={"Logout"} onPress={signOut} />
          <View style={{ position: "absolute", top: "10%", left: "95%" }}>
            <TouchableOpacity onPress={toggleModal}>
              <Feather name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Modal visible={modalVisible}>
            <Layout style={{ flex: 1, padding: 16 }}>
              <Text category="h2" style={styles.preferenceStyle}>
                Préférences
              </Text>
              <List style={{backgroundColor: 'rgba(52, 52, 52, 0)'}}
                data={[
                  {
                    title: "Private messages",
                    name: "accept_pms",
                    checked: userPreferencesData?.accept_pms,
                  },
                  {
                    title: "Email messages",
                    name: "email_messages",
                    checked: userPreferencesData?.email_messages,
                  },
                  {
                    title: "Activity Relevant Ads",
                    name: "activity_relevant_ads",
                    checked: userPreferencesData?.activity_relevant_ads,
                  },
                  {
                    title: "Night mode",
                    name: "nightmode",
                    checked: userPreferencesData?.nightmode,
                  },
                  {
                    title: "Mark Messages Read",
                    name: "mark_messages_read",
                    checked: userPreferencesData?.mark_messages_read,
                  },
                  {
                    title: "Highlight controversial",
                    name: "highlight_controversial",
                    checked: userPreferencesData?.highlight_controversial,
                  },
                ]}
                renderItem={({ item }) => {
                  if (item.name === "accept_pms") {
                    return (
                      <View>
                        <Text category='s1' style={{top:"40%", left:"4.5%"}}>{item.title}</Text>
                        <RadioGroup
                          selectedIndex={options.findIndex(
                            (option) => option.value === item.checked
                          )}
                          onChange={(index) => {
                            const selectedValue = options[index].value;
                            handlePreferenceChange(
                              item.name as keyof UserPreferencesDataType,
                              selectedValue
                            );
                          }}
                        >
                          {options.map((option) => (
                            <Radio style={styles.radioButtons} key={option.value}>{option.label}</Radio>
                          ))}
                        </RadioGroup>
                      </View>
                    );
                  } else {
                    return (
                      <ListItem
                        style={{marginTop:"10%"}}
                        title={item.title}
                        accessoryRight={() => (
                          <Toggle
                            checked={item.checked as boolean}
                            onChange={(checked) =>
                              handlePreferenceChange(
                                item.name as keyof UserPreferencesDataType,
                                checked
                              )
                            }
                          />
                        )}
                      />
                    );
                  }
                }}
              />
              <Button style={styles.okButton} onPress={handleSave} size="large">
                OK
              </Button>
            </Layout>
          </Modal>
        </>
      )}
    </Layout>
  );
};

export default UserProfile;
