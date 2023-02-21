import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ApiService, PostType } from "../services/apiService";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { Spinner, Layout } from "@ui-kitten/components";
import { CardItem } from "../components/CardItem";

export const Feed = () => {
  const [subscribedPosts, setSubscribedPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthAccessToken();

  const fetchSubscribedPosts: () => Promise<void> = useCallback(async () => {
    try {
      const data = await ApiService.getSubscribedPosts(accessToken);
      setSubscribedPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchSubscribedPosts();
  }, [fetchSubscribedPosts]);

  const onRefresh = async () => {
    try {
      await fetchSubscribedPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Layout style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Spinner size="giant" />
          </View>
        ) : (
          <FlatList
            data={subscribedPosts}
            renderItem={CardItem}
            keyExtractor={(item) => item.id}
            onRefresh={onRefresh}
            refreshing={loading}
          />
        )}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
