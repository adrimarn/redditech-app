import React, { useEffect, useState } from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { StyleSheet, Image, View, FlatList, SafeAreaView } from "react-native";
import { Layout, Card, Input, Text, Button } from "@ui-kitten/components";
import { ApiService, dataInfoSubbredit } from "../services/apiService";

const Search = ({ navigation }: any) => {
  const { accessToken } = useAuthAccessToken();
  const [subredditInput, setSubredditInput] = useState<string>();
  const [subRedditInfo, setSubRedditInfo] = useState<
    dataInfoSubbredit[] | undefined
  >();
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastSubRedditId, setLastSubRedditId] = React.useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSubRedditName, setLastSubRedditName] = React.useState<string>();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchSubReddit(true, true);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onInputChange = (value: string) => {
    setSubredditInput(value);
  };

  const handleSearch = async () => {
    await fetchSubReddit(true);
  };

  const fetchSubReddit = async (isReset = false, isRefresh = false) => {
    if (isLoading) return;
    setIsLoading(true);

    // Définir lastSubRedditId sur undefined si isReset est true
    const lastId = isReset ? undefined : lastSubRedditId;
    const lastName = isRefresh ? lastSubRedditName : subredditInput;

    const data = await ApiService.getSubRedditByName(
      lastName,
      undefined,
      lastId,
      10
    );

    setSubRedditInfo((prevState) => {
      if (prevState && !isReset) {
        return [...prevState, ...data];
      }
      return data;
    });
    setLastSubRedditId(data[data.length - 1].name);
    setLastSubRedditName(lastName);
    setIsLoading(false);
  };

  const onPress = (titleName: string) => {
    navigation.navigate("Posts", {
      titleName: titleName,
    });
  };

  const handleScrollEnd = async () => {
    await fetchSubReddit();
  };
  const renderItem = ({ item }: { item: dataInfoSubbredit }) => (
    <Category item={item} />
  );

  const Category = ({ item }: { item: dataInfoSubbredit }) => {
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
            onPress={() => onPress(item.display_name_prefixed)}
            key={item.id}
            style={styles.cardContainer}
          >
            <View style={styles.imgContainer}>
              <Image
                style={styles.img}
                source={{
                  uri: item.header_img ? item.header_img : undefined,
                }}
              />
            </View>

            <Text style={styles.icon}>{item.subscribers} subscribers</Text>
            <Text>{item.user_is_subscriber}</Text>
            <Text category="h6">{item.display_name_prefixed}</Text>
            <Text>{item.public_description}</Text>

            <SubscribeButton para1={item.display_name_prefixed} />
          </Card>
        )}
      </>
    );
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <View>
          <Input
            style={styles.input}
            placeholder="Search a subbredit name"
            onChangeText={onInputChange}
            value={subredditInput}
          />
          <Button onPress={handleSearch}>Search</Button>
        </View>
        <FlatList
          data={subRedditInfo}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleScrollEnd}
          onEndReachedThreshold={0.2}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </SafeAreaView>
    </Layout>
  );
};

export default Search;

const styles = StyleSheet.create({
  input: {
    marginVertical: 50,
  },
  container: {
    flex: 1,
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
