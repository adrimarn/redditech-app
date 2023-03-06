import React, { useCallback, useEffect } from "react";
import { Layout, Text } from "@ui-kitten/components";
import { ApiService } from "../services/apiService";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import PostItem, { PostType } from "../components/PostItem";

export const HomeScreen = ({ navigation }: any) => {
  const { accessToken } = useAuthAccessToken();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [posts, setPosts] = React.useState<PostType[] | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const posts = await ApiService.getSubscribedPosts(accessToken, 10);
      setPosts(posts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [accessToken]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPosts();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const RenderItem = useCallback(
    ({ item, onPress }: { item: PostType; onPress: any }) => (
      <PostItem post={item} onPress={onPress} />
    ),
    []
  );

  const onPostPress = (postID: string) => {
    //console.log("Post pressed: ", postID);
    navigation.navigate("Post", { postID });
  };

  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SafeAreaView />
      {loading ? (
        <Text category="h1">Loading...</Text>
      ) : (
        <>
          {posts && posts.length ? (
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onPostPress(item.id)}>
                  <RenderItem
                    item={item}
                    onPress={() => onPostPress(item.id)}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item?.id}
              onRefresh={onRefresh}
              refreshing={refreshing}
            />
          ) : (
            <Text category="h1">No posts to show.</Text>
          )}
        </>
      )}
    </Layout>
  );
};
