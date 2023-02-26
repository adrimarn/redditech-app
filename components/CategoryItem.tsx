import React, { useEffect, useState } from "react";
import { ApiService } from "../services/apiService";
import {
  ImageBackground,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text as KText } from "@ui-kitten/components/ui/text/text.component";

const handleCardPress = (url: string) => {
  //TODO: Redirect to subreddit posts
  // Linking.openURL(url);
};

export interface CategoryItemProps {
  id: string;
  name: string;
  description: string;
  url: string;
  subscribersCount: number;
}

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const CategoryItem = ({ item }: { item: CategoryItemProps }) => (
  <ItemView item={item} />
);

const ItemView = ({ item }: { item: CategoryItemProps }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const getThumbnail = async () => {
      try {
        const thumbnailUrl = await ApiService.getLatestPostThumbnail(
          item.name.slice(2)
        );
        setThumbnail(thumbnailUrl);
      } catch (error) {
        console.log(error);
      }
    };

    getThumbnail();
  }, []);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleCardPress(item.url)}>
        <ImageBackground
          style={styles.image}
          source={thumbnail ? { uri: thumbnail } : undefined}
          resizeMode="cover"
          imageStyle={styles.imageStyle}
        >
          <View style={styles.text}>
            <KText category="h5" style={styles.title}>
              {item.name}
            </KText>
            <KText appearance="hint" category="s1" style={styles.subtitle}>
              {numberWithSpaces(item.subscribersCount)} members
            </KText>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
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
