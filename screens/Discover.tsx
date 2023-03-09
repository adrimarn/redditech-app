import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { ApiService } from "../services/apiService";
import { Spinner, Layout, Text } from "@ui-kitten/components";
import { CategoryItem, CategoryItemProps } from "../components/CategoryItem";
import { useFocusEffect } from "@react-navigation/native";

const Discover = () => {
  const [subreddits, setSubreddits] = useState<CategoryItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchSubreddits: (loadingIndicator?: boolean) => Promise<void> =
    useCallback(async (loadingIndicator) => {
      try {
        if (loadingIndicator) setLoading(true);
        const data = await ApiService.getRandomSubreddits();
        if (data) {
          setFetched(true);
          setSubreddits(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!fetched) {
        fetchSubreddits(true);
      }
    }, [fetched])
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchSubreddits();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Layout style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Spinner size="giant" />
        </View>
      ) : (
        <>
          <SafeAreaView>
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
          </SafeAreaView>
        </>
      )}
    </Layout>
  );
};

export default Discover;

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
