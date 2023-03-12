import React, { useEffect } from "react";
import { Text, Avatar } from "@ui-kitten/components";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ApiService } from "../services/apiService";

export type PostType = {
  id: string;
  permalink: string;
  title: string;
  author: string;
  selftext: string;
  subreddit?: string;
  subreddit_name_prefixed?: string;
  thumbnail: string;
  url: string;
  created_utc: Date;
  preview?: {
    images: [
      {
        source: {
          url: string | undefined;
        };
      }
    ];
  };
};

const PostItem = ({ post, onPress }: { post: PostType; onPress: any }) => {
  const PostImage = () => (
    <Image
      style={styles.image}
      source={{ uri: post.preview?.images[0].source.url }}
    />
  );

  const Header = () => {
    const [avatar, setAvatar] = React.useState<string | undefined>();
    useEffect(() => {
      async function getAvatar() {
        try {
          const avatarUrl = await ApiService.getUserAvatar(post.author);
          setAvatar(avatarUrl);
        } catch (error) {
          console.log(error);
        }
      }
      getAvatar();
    }, []);
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar
          source={{ uri: avatar }}
          style={{ marginRight: 8 }}
          size={"small"}
        />
        <Text category="s1">{post.author}</Text>
      </View>
    );
  };

  return (
    <>
      <Animated.View
        style={{
          margin: 10,
          backgroundColor: "#26243E",
          borderRadius: 25,
          padding: 20,
        }}
        entering={FadeIn?.delay?.(50)?.duration(300)}
      >
        <TouchableOpacity onPress={onPress}>
          <Header />
          <View
            style={{
              flexDirection: "column",
              padding: 0,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{ marginBottom: 8 }} category="h6">
              {post.title}
            </Text>
            {post?.preview?.images?.[0].source.url ? (
              <PostImage />
            ) : (
              <Text style={{ marginVertical: 20 }}>{post.selftext}</Text>
            )}
            <Text
              appearance="hint"
              category="c1"
            >{`Posted in ${post.subreddit_name_prefixed}`}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 170,
    width: "100%",
    marginVertical: 20,
    borderRadius: 25,
  },
});

export default PostItem;
