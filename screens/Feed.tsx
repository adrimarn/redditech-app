import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from "react-native";
import { ApiService, PostType } from "../services/apiService";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { Spinner, Text as KText, Layout } from "@ui-kitten/components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  subtitle: {
    marginBottom: 10,
  },
  image: {
    height: 150,
    width: "100%",
  },
  imageStyle: {
    borderRadius: 8,
  },
  text: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
});
const handleCardPress = (url: string) => {
  Linking.openURL(url);
};

const FeedItem = React.memo(
  ({ item }: { item: PostType }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleCardPress(item.url)}>
        <ImageBackground
          style={styles.image}
          source={{ uri: item.thumbnail }}
          resizeMode="cover"
          imageStyle={styles.imageStyle}
        >
          <View style={styles.text}>
            <KText category="h5" style={styles.title}>
              {item.title}
            </KText>
            <KText appearance="hint" category="s1" style={styles.subtitle}>
              {item.subreddit_name_prefixed}
            </KText>
            <KText>{item.author}</KText>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  ),
  (prevProps, nextProps) => {
    // Only re-render the component if the item prop changes
    return prevProps.item === nextProps.item;
  }
);

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

  const renderItem = ({ item }: { item: PostType }) => <FeedItem item={item} />;

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
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onRefresh={onRefresh}
            refreshing={loading}
          />
        )}
      </Layout>
    </SafeAreaView>
  );
};
