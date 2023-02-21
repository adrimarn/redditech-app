import React, { useEffect, useState } from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { StyleSheet, Image, View, RefreshControl } from "react-native";
import {
  Layout,
  Card,
  Input,
  useTheme,
  Text,
  Icon,
  Button,
} from "@ui-kitten/components";
import { ApiService } from "../services/apiService";
import { SubRedditInformation } from "../services/apiService";
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
      marginTop: 80
      
      
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
          <Text style={{textAlign: "center"}}>{route.params.titleName}</Text>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default Posts;
