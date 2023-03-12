import React, { useEffect, useState } from "react";
import { ApiService } from "../services/apiService";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Text as KText } from "@ui-kitten/components/ui/text/text.component";

export interface CategoryItemProps {
  id: string;
  name: string;
  description: string;
  url: string;
  subscribersCount: number;
  banner_img: string;
  banner_background_image: string;
}

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const CategoryItem = ({
  item,
  index,
  onPress,
}: {
  item: CategoryItemProps;
  index: number;
  onPress: any;
}) => <ItemView item={item} onPress={onPress} index={index} />;

const ItemView = ({
  item,
  index,
  onPress,
}: {
  item: CategoryItemProps;
  onPress: any;
  index: number;
}) => {
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
    <Animated.View
      style={styles.card}
      entering={FadeIn?.delay?.(100 + index * 50)?.duration(300)}
    >
      <TouchableOpacity onPress={onPress}>
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
            <KText appearance="alternative" category="label" status="basic" style={styles.subtitle}>
              {numberWithSpaces(item.subscribersCount)} members
            </KText>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
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
    backgroundColor: "rgba(38,36,62,1)",
    borderRadius: 25,
  },
  imageStyle: {
    borderRadius: 25,
  },
  text: {
    backgroundColor: "rgba(38,36,62,0.20)",
    flex: 1,
    padding: 10,
    borderRadius: 25,
  },
});
