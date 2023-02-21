import React from "react";
import { PostType } from "../services/apiService";
import {
  ImageBackground,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text as KText } from "@ui-kitten/components/ui/text/text.component";

const handleCardPress = (url: string) => {
  Linking.openURL(url);
};

export const CardItem = ({ item }: { item: PostType }) => (
  <ItemView item={item} />
);

const ItemView = React.memo(
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
