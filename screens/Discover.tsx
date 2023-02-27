import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { ApiService } from "../services/apiService";
import { Spinner, Layout, Text } from "@ui-kitten/components";
import { CategoryItem, CategoryItemProps } from "../components/CategoryItem";

export const Discover = () => {
  //const [subscribedPosts, setSubscribedPosts] = useState<PostType[]>([]);
  const [subreddits, setSubreddits] = useState<CategoryItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchSubreddits: () => Promise<void> = useCallback(async () => {
    try {
      const data = await ApiService.getRandomSubreddits();
      setSubreddits(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubreddits();
  }, [fetchSubreddits]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchSubreddits();
    } catch (error) {
      console.error(error);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222B45" }}>
      <Layout style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Spinner size="giant" />
          </View>
        ) : (
          <>
            {subreddits.length > 0 ? (
              <FlatList
                data={subreddits}
                renderItem={CategoryItem}
                keyExtractor={(item) => item?.id}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text category="h6">No posts to show</Text>
              </View>
            )}
          </>
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
