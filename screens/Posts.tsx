import React from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { StyleSheet, View } from "react-native";
import { Layout, useTheme, Text } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";

const Posts = ({ navigation, route }: any) => {
  const { accessToken } = useAuthAccessToken();

  const theme = useTheme();

  const styles = StyleSheet.create({
    input: {
      marginVertical: 50,
    },
    container: {
      flexGrow: 1,
      backgroundColor: theme["color-basic-900"],
      paddingHorizontal: 8,
    },
    cardContainer: {
      width: "90%",
      alignSelf: "center",
      marginVertical: 16,
      borderRadius: 6,
      marginTop: 80,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 8,
      textAlign: "center",
      marginHorizontal: 10,
    },
  });

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View style={styles.cardContainer}>
          <Text style={{ textAlign: "center" }}>{route.params.titleName}</Text>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default Posts;
