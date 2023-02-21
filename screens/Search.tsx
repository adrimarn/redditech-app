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
import {
  SubRedditInformation,
  RedditApiResponse,
} from "../services/apiService";
import { ScrollView } from "react-native-gesture-handler";

const Search = ({ navigation }: any) => {
  const { accessToken } = useAuthAccessToken();
  const [subRedditName, setSubRedditName] = useState<string>();
  const [subRedditInfo, setSubRedditInfo] = useState<SubRedditInformation>();
  const [subscriredSub, setSubscriredSub] = useState<RedditApiResponse>();
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
      borderRadius: 6,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 8,
      textAlign: "center",
      marginHorizontal: 10,
    },
    icon: {
      width: "100%",
      height: 32,
      tintColor: theme["color-primary-500"],
      marginRight: 8,
      textAlign: "center",
      marginVertical: 10,
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
    const res = await ApiService.getSubscridedSubReddit(accessToken);
    setSubscriredSub(res);
  };

  const onPress = (titleName: string) => {
    navigation.navigate("Posts", {
      titleName: titleName,
    });
  };

 

  const SubscribeButton = (props: any) => {
    let isSubscribed = false;
    subscriredSub?.data.children.map((item) => {
      if (item.data.display_name === props.para1) {
        isSubscribed = true;
      }
    });
    if (isSubscribed) {
      return <Button style={{ marginVertical: 10 }}>Unsubscribe</Button>;
    } else {
      return (
        <Button
          onPress={() => ApiService.subscribeToSubreddit(props.para2,accessToken)}
          style={{ marginVertical: 10 }}
        >
          Subscribe
        </Button>
      );
    }
  };

  return (
    <Layout style={styles.container}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Input
          style={styles.input}
          placeholder="Search a subbredit name"
          onChangeText={onChange}
        />
        <Button onPress={searchSubReddit}>Search</Button>
        {subRedditInfo &&
          subRedditInfo.data.children.map((i, idx) => (
            <Card
              onPress={() => onPress(i.data.title)}
              key={idx}
              style={styles.cardContainer}
            >
              <View style={styles.imgContainer}>
                <Image style={styles.img} source={{ uri: i.data.header_img }} />
              </View>
              <Text>{i.data.id}</Text>
              <Text style={styles.icon}>{i.data.subscribers} subscribers</Text>
              <Text>{i.data.user_is_subscriber}</Text>
              <Text category="h6">{i.data.title}</Text>
              <Text>{i.data.public_description}</Text>

              <SubscribeButton para1={i.data.title} para2={i.data.title} />
            </Card>
          ))}
      </ScrollView>
    </Layout>
  );
};

export default Search;
