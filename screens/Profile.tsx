import React from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { ApiService, UserDataType } from "../services/apiService";
import { Image, StyleSheet } from "react-native";
import { Layout, Text, Divider, useTheme, Button } from "@ui-kitten/components";

const UserProfile = () => {
  const { accessToken } = useAuthAccessToken();
  const [userData, setUserData] = React.useState<UserDataType>();
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
        </>
      )}
    </Layout>
  );
};

export default UserProfile;
