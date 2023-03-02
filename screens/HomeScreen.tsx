import React, { useEffect } from "react";
import { Layout, Text } from "@ui-kitten/components";
import { ApiService } from "../services/apiService";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { FlatList, SafeAreaView } from "react-native";
import PostItem, { PostType } from "../components/PostItem";

export const HomeScreen = () => {
  const { accessToken } = useAuthAccessToken();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [posts, setPosts] = React.useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await ApiService.getSubscribedPosts(accessToken);
        setPosts(posts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const renderItem = ({ item }: { item: PostType }) => <PostItem post={item} />;

  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SafeAreaView>
        {loading ? (
          <Text category="h1">Loading...</Text>
        ) : (
          <>
            <FlatList
              data={posts}
              renderItem={renderItem}
              keyExtractor={(item) => item?.id}
            />
          </>
        )}
      </SafeAreaView>
    </Layout>
  );
};
