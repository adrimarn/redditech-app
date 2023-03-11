import React, { useCallback, useEffect, useState } from "react";
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

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackIcon: RenderProp<Partial<ImageProps>> = (props) => (
    <Icon {...props} name="arrow-back" />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await ApiService.getSubredditPosts(
          subreddit.name.slice(2),
          accessToken,
          filter
        );

        const posts = res.map(({ data }: any): PostType => data);

        //console.log("POSTS:", posts);
        setPosts(posts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [filter]);

  const RenderItem = useCallback(
    ({ item, onPress }: { item: PostType; onPress: any }) => (
      <PostItem post={item} onPress={onPress} />
    ),
    []
  );

  const onPostPress = (post: PostType) => {
    navigation.navigate("Post", { post });
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
            keyExtractor={(item) => item?.id}
            //onRefresh={onRefresh}
            //refreshing={refreshing}
          />
        )}
      </SafeAreaView>
    </Layout>
  );
};

const Header = ({ backgroundImage }: any) => {
  return (
    <View>
      <ImageBackground style={styles.image} source={{ uri: backgroundImage }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#2E3A59",
  },
});

export default Posts;
