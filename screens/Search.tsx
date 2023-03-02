import React, { useEffect, useState } from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import {StyleSheet, Image, View, RefreshControl, SafeAreaView} from "react-native";
import {
  Layout,
  Card,
  Input,
  useTheme,
  Text,
  Button,
} from "@ui-kitten/components";
import { ApiService, dataInfoSubbredit } from "../services/apiService";
import { SubRedditInformation } from "../services/apiService";
import { ScrollView } from "react-native-gesture-handler";

const Search = ({ navigation }: any) => {
  const { accessToken } = useAuthAccessToken();
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
      marginVertical: 10,
    },
    container: {
      flexGrow: 1,
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
    const data = await ApiService.getSubRedditByName(subRedditName as string);
    setSubRedditInfo(data);
  };

  const onPress = (titleName: string) => {
    navigation.navigate("Posts", {
      titleName: titleName,
    });
  };

  const Category = ({ data: item }: { data: dataInfoSubbredit }) => {
    const SubscribeButton = (props: any) => {
      const [isSubscribed, setIsSubscribed] = useState(false);

      const handleSubscribe = (subbreditName: string) => {
        ApiService.subscribeToSubreddit(subbreditName, accessToken).then(() => {
          setIsSubscribed(true);
        });
      };

      const handleUnSubscribe = async (subbreditName: string) => {
        ApiService.subscribeToSubreddit(
          subbreditName,
          accessToken,
          "unsub"
        ).then(() => {
          setIsSubscribed(false);
        });
      };

      useEffect(() => {
        const result = ApiService.hasSubscribed(props.para1, accessToken);
        result.then((data: boolean) => {
          setIsSubscribed(data);
        });
      }, []);

      if (isSubscribed) {
        return (
          <Button
            onPress={() => handleUnSubscribe(props.para1)}
            style={{ marginVertical: 10 }}
          >
            Unsubscribe
          </Button>
        );
      } else {
        return (
          <Button
            onPress={() => handleSubscribe(props.para1)}
            style={{ marginVertical: 10 }}
          >
            Subscribe
          </Button>
        );
      }
    };

    return (
      <>
        {item && (
          <Card
            onPress={() => onPress(item.data.display_name_prefixed)}
            key={item.data.id}
            style={styles.cardContainer}
          >
            <View style={styles.imgContainer}>
              <Image
                style={styles.img}
                source={{ uri: item.data.header_img }}
              />
            </View>

            <Text style={styles.icon}>{item.data.subscribers} subscribers</Text>
            <Text>{item.data.user_is_subscriber}</Text>
            <Text category="h6">{item.data.display_name_prefixed}</Text>
            <Text>{item.data.public_description}</Text>

            <SubscribeButton para1={item.data.display_name_prefixed} />
          </Card>
        )}
      </>
    );
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView />
        <Input
          style={styles.input}
          placeholder="Search a subbredit name"
          onChangeText={onChange}
        />
        <Button onPress={searchSubReddit}>Search</Button>
      <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
      >
        {subRedditInfo &&
          subRedditInfo.data.children.map((i, idx) => {
            return <Category key={idx} data={i} />;
          })}
      </ScrollView>
    </Layout>
  );
};

export default Search;
