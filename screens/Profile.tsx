import React, { useEffect, useState } from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import {
  ApiService,
  UserDataType,
  UserPreferencesDataType,
} from "../services/apiService";
import { Image, StyleSheet, View, Modal } from "react-native";
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
} from "@ui-kitten/components";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const UserProfile = () => {
  const { accessToken } = useAuthAccessToken();
  const [userData, setUserData] = React.useState<UserDataType>();
  const [userPreferencesData, setUserPreferencesData] =
    React.useState<UserPreferencesDataType>();
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
  });

  function updatePreferences() {
    setUserPreferencesData(userPreferencesData);
  }

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
    preferenceName: string,
    value: boolean | number
  ) => {
    setUserPreferencesData((prevState) => ({
      ...prevState,
      [preferenceName]: value,
    }));
    console.log("UserPreferencesData:")
    console.log(userPreferencesData?.activity_relevant_ads)
    console.log(userPreferencesData?.email_messages)
    console.log(userPreferencesData?.highlight_controversial)
    console.log(userPreferencesData?.mark_messages_read)
    console.log(userPreferencesData?.nightmode)
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    updatePreferences();
  };

  const handleSave = () => {
    if (userPreferencesData)
      ApiService.updateUserPreferences(accessToken, userPreferencesData)
    toggleModal();
  };

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
          <Button style={styles.editButton} size="large">
            Edit
          </Button>
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
              <List
                data={[
                  {
                    title: "Private messages",
                    name: "accept_pms",
                    checked: userPreferencesData?.accept_pms,
                  },
                  {
                    title: "Email messages",
                    name: "emailMessages",
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
                    name: "highlightControversial",
                    checked: userPreferencesData?.highlight_controversial,
                  },
                ]}
                renderItem={({ item }) => {
                  if (item.name === "accept_pms") {
                    return (
                      <Input
                        label={item.title}
                        value={item.checked?.toString()}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          handlePreferenceChange(
                            item.name,
                            parseInt(text)
                          )
                        }
                      />
                    );
                  } else {
                    return (
                      <ListItem
                        title={item.title}
                        accessoryRight={() => (
                          <Toggle
                            checked={item.checked as boolean}
                            onChange={(checked) =>
                              handlePreferenceChange(
                                item.name,
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
