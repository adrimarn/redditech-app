import React, { useState } from "react";
import { StyleSheet, Image, View, RefreshControl } from "react-native";
import {
  Layout,
  Card,
  Input,
  useTheme,
  Text,
  Button,
} from "@ui-kitten/components";
import { ApiService } from "../services/apiService";
import { SubRedditInformation } from "../services/apiService";
import { ScrollView } from "react-native-gesture-handler";

const Search = () => {
  const [subRedditName, setSubRedditName] = useState<string>();
  const [subRedditInfo, setSubRedditInfo] = useState<SubRedditInformation>();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
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
      borderRadius: 6

    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 8,
      textAlign: "center",
      marginHorizontal: 10
    },
    icon: {
      width: "100%",
      height: 32,
      tintColor: theme["color-primary-500"],
      marginRight: 8,
      textAlign: 'center',
      marginVertical: 10
    },
    img: {
      width: 50,
      height: 50,
    },
    imgContainer: {
      flex: 1,
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const onChange = (value: string) => {
    setSubRedditName(value);
  };

  const searchSubReddit = async () => {
    const data = await ApiService.getSubReddit(subRedditName as string);
    setSubRedditInfo(data);
  };

  return (
    <Layout style={styles.container}>
        <ScrollView
        
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
     
        <Input
          style={styles.input}
          placeholder="Search a subbredit name"
          onChangeText={onChange}
        />
        <Button onPress={searchSubReddit}>Search</Button>
        {subRedditInfo &&
          subRedditInfo.data.children.map((item, idx) => (
            <Card key={idx} style={styles.cardContainer}>
              <View style={styles.imgContainer}>
                <Image
                  style={styles.img}
                  source={{ uri: item.data.header_img }}
                />
              </View>
              <Text style={styles.icon}>
                {item.data.subscribers} subscribers
              </Text>
              <Text category="h6">{item.data.title}</Text>
              <Text>{item.data.public_description}</Text>
            </Card>
          ))}
      </ScrollView>
    </Layout>
  );
};

export default Search;
