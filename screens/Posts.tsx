import React, { useEffect, useState } from "react";
import { useAuthAccessToken } from "../contexts/AuthContext";
import {
  FlatList,
  ImageBackground,
  ImageProps,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import {
  Layout,
  Icon,
  TopNavigationAction,
  TopNavigation,
  Divider,
  Spinner,
  Button,
  Text,
} from "@ui-kitten/components";
import { RenderProp } from "@ui-kitten/components/devsupport";
import PostItem, { PostType } from "../components/PostItem";
import { CategoryItemProps } from "../components/CategoryItem";
import { ApiService } from "../services/apiService";
import { ButtonsProps, Filter } from "../components/Filter";

const Posts = ({ navigation, route }: any) => {
  const { accessToken } = useAuthAccessToken();
  const { subreddit }: { subreddit: CategoryItemProps } = route.params;
  const [posts, setPosts] = useState<PostType[]>();
  const [filter, setFilter] = useState<ButtonsProps["filter"]>("hot");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastPostId, setLastPostId] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackIcon: RenderProp<Partial<ImageProps>> = (props) => (
    <Icon {...props} name="arrow-back" />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const handleScrollEnd = async () => {
    await fetchPosts(true);
  };

  async function fetchPosts(refresh = false, reset = false) {
    if (isFetching) return;
    const lastId = reset ? undefined: lastPostId
    try {
      setIsFetching(true);
      if (!refresh) setLoading(true);
      const res = await ApiService.getSubredditPosts(
        subreddit.name.slice(2),
        accessToken,
        filter,
        10,
        undefined,
        lastId
      );

      const posts = res.map(({ data }: any): PostType => data);
      setPosts((prevState) => {
        if (prevState && !reset) {
          return [...prevState, ...posts];
        }
        return posts;
      });
      setLastPostId(posts[posts.length - 1].name);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchPosts(undefined, true);
  }, [filter]);

  const RenderItem = ({ item, onPress }: { item: PostType; onPress: any }) => (
    <PostItem post={item} onPress={onPress} />
  );

  const onPostPress = (post: PostType) => {
    navigation.navigate("Post", { post });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPosts(true);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={subreddit.name}
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Header
          backgroundImage={
            subreddit.banner_img != ""
              ? subreddit.banner_img
              : subreddit.banner_background_image
          }
          subreddit={subreddit}
          accessToken={accessToken}
        />
        <View style={{ paddingBottom: 15 }}>
          <Filter filter={filter} setFilter={setFilter} />
        </View>
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", paddingTop: 100 }}>
            <Spinner size="giant" />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <RenderItem item={item} onPress={() => onPostPress(item)} />
            )}
            keyExtractor={(item: PostType) => item?.id}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={handleScrollEnd}
          />
        )}
      </SafeAreaView>
    </Layout>
  );
};

const Header = ({
                  backgroundImage,
                  subreddit,
                  accessToken,
                }: {
  backgroundImage: string;
  subreddit: CategoryItemProps;
  accessToken: string;
}) => {
  return (
    <View>
      <ImageBackground style={styles.image} source={{ uri: backgroundImage }}>
        <View
          style={{
            flex: 1,
            backgroundColor: backgroundImage ? "rgba(0,0,0,0.5)" : undefined,
            paddingHorizontal: 10,
          }}
        >
          <SubscribeButton
            subredditName={subreddit.name}
            accessToken={accessToken}
          />
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text
              style={{
                marginTop: 10,
                textAlign: "center",
                fontSize: 12,
                alignSelf: "center",
                paddingBottom: 10,
                width: "100%",
              }}
              category="c1"
            >
              {subreddit.description}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const SubscribeButton = ({
                           subredditName,
                           accessToken,
                         }: {
  subredditName: string;
  accessToken: string;
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const buttonText = isSubscribed ? "Leave" : "Join";

  const handleSubscribeClick = () => {
    ApiService.subscribeToSubreddit(subredditName, accessToken)
      .then(() => setIsSubscribed(true))
      .catch((error) => console.error("Failed to subscribe:", error));
  };

  const handleUnsubscribeClick = () => {
    ApiService.subscribeToSubreddit(subredditName, accessToken, "unsub")
      .then(() => setIsSubscribed(false))
      .catch((error) => console.error("Failed to unsubscribe:", error));
  };

  useEffect(() => {
    ApiService.hasSubscribed(subredditName, accessToken)
      .then((isUserSubscribed: boolean) => setIsSubscribed(isUserSubscribed))
      .catch((error) =>
        console.error("Failed to check subscription status:", error)
      );
  }, [subredditName, accessToken]);

  return (
    <Button
      onPress={isSubscribed ? handleUnsubscribeClick : handleSubscribeClick}
      style={{
        marginVertical: 10,
        width: 100,
        alignSelf: "flex-end",
        borderRadius: 20,
      }}
      appearance={isSubscribed ? "outline" : "filled"}
      status={isSubscribed ? "control" : "primary"}
      size="small"
    >
      {buttonText}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#272541",
  },
});

export default Posts;
