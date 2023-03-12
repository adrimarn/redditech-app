import React from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import {
  ApiService,
  UserDataType,
  UserPreferencesDataType,
} from "../services/apiService";
import { Image, StyleSheet, View, Button as NButton } from "react-native";
import {
  Layout,
  Text,
  Divider,
  useTheme,
  Button,
  Toggle,
  List,
  ListItem,
  RadioGroup,
  Radio,
} from "@ui-kitten/components";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useModal } from "../contexts/ModalContext";

const UserProfile = () => {
  const { accessToken, signOut } = useAuthAccessToken();
  const [userData, setUserData] = React.useState<UserDataType>();
  const { handleOpenModal, handleCloseModal } = useModal();
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
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
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      color: theme["text-hint-color"],
      lineHeight: 24,
      textAlign: "center",
    },
    divider: {
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
      textAlign: "center",
    },
    radioButtons: {
      left: "350%",
    },
  });

  async function fetchUserData() {
    const res = await ApiService.getUser(accessToken);
    setUserData(res);
  }

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const openUserPreferences = () => {
    handleOpenModal(<ModalContent />, ["82", "0", "0"]);
  };

  const ModalContent = () => {
    const [userPreferencesData, setUserPreferencesData] =
      React.useState<UserPreferencesDataType>({
        accept_pms: "",
        email_messages: false,
        activity_relevant_ads: false,
        nightmode: false,
        mark_messages_read: false,
        highlight_controversial: false,
      });

    const options = [
      { label: "Everyone", value: "everyone" },
      { label: "Whitelisted", value: "whitelisted" },
    ];

    const handlePreferenceChange = (
      preferenceName: keyof UserPreferencesDataType,
      value: boolean | string | undefined
    ) => {
      setUserPreferencesData({
        ...userPreferencesData,
        [preferenceName]: value,
      });
    };

    const handleSave = () => {
      setTimeout(() => {
        ApiService.updateUserPreferences(accessToken, userPreferencesData);
      }, 1000);
      handleCloseModal();
    };

    async function fetchUserPreferencesData() {
      const res = await ApiService.getUserPreferences(accessToken);
      setUserPreferencesData(res);
    }

    React.useEffect(() => {
      fetchUserPreferencesData();
    }, []);

    return (
      <View
        style={{
          height: "100%",
        }}
      >
        <Layout
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: "#272541",
            borderRadius: 40,
          }}
        >
          <Text category="h2" style={styles.preferenceStyle}>
            Préférences
          </Text>
          <List
            style={{ backgroundColor: "#272541" }}
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
                    <Text category="s1" style={{ top: "40%", left: "4.5%" }}>
                      {item.title}
                    </Text>
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
                        <Radio style={styles.radioButtons} key={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </View>
                );
              } else {
                return (
                  <ListItem
                    style={{
                      marginTop: "5%",
                      backgroundColor: "#272541",
                    }}
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
      </View>
    );
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
          <NButton title={"Logout"} onPress={signOut} />
          <View style={{ position: "absolute", top: "10%", left: "85%" }}>
            <TouchableOpacity onPress={openUserPreferences}>
              <Feather name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </Layout>
  );
};

export default UserProfile;
