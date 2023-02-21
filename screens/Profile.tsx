import React, { useEffect, useState } from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { ApiService, UserDataType } from "../services/apiService";
import { Image, StyleSheet, View, Modal } from "react-native";
import {
  Layout,
  Text,
  Divider,
  useTheme,
  Button,
  Input,
} from "@ui-kitten/components";
import { Feather } from "@expo/vector-icons";

const UserProfile = () => {
  const { accessToken } = useAuthAccessToken();
  const [userData, setUserData] = React.useState<UserDataType>();
  const [username, setUsername] = React.useState<string | undefined>();
  const [description, setDescription] = React.useState<string | undefined>();
  const [isOnEdit, setisOnEdit] = React.useState(false);
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
  });

  React.useEffect(() => {
    async function fetchUserData() {
      const res = await ApiService.getUser(accessToken);
      setUserData(res);
    }
    fetchUserData();
  }, []);

  // Les six paramètres utilisateur que vous souhaitez modifier
  const userPreferences = [
    "threaded_messages",
    "email_messages",
    "show_link_flair",
    "nightmode",
    "min_comment_score",
    "highlight_controversial",
  ];

    const [modalVisible, setModalVisible] = React.useState(false);

    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };

    const handleSave = () => {
      // Code pour enregistrer les préférences utilisateur modifiées
      toggleModal();
    };

    // const renderPreferences = () => {
    //   return userPreferences.map((preference) => (
    //     // Remplacez `PreferenceItem` par un composant personnalisé pour chaque paramètre utilisateur
    //     //<PreferenceItem key={preference} preference={preference} />
    //   ));
    // };
    // const openModal = () => {
    //   setisOnEdit(!isOnEdit);
    //   setUsername(userData?.name);
    //   setDescription(userData?.subreddit.public_description);
    // };
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
          <Button
            accessoryLeft={(props) => (
              <Feather name="settings" size={24} color="black" />
            )}
            onPress={toggleModal} style={{position:"absolute", top:"10%"}}
          ></Button>
          <Modal visible={modalVisible}>
            <Text category="h4">Modifier les préférences</Text>
            <Button onPress={handleSave}>Enregistrer</Button>
          </Modal>
        </>
      )}
    </Layout>
  );
};

export default UserProfile;
