import React from "react";
import { Card, Text, Avatar } from "@ui-kitten/components";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export type PostType = {
  id: string;
  permalink: string;
  num_comments: number;
  title: string;
  author: string;
  selftext: string;
  subreddit?: string;
  subreddit_name_prefixed?: string;
  thumbnail: string;
  ups: number;
  downs: number;
  url: string;
  created_utc: Date ;
  created: number;
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
  const ImageHeader = () => (
    <Image
      style={styles.image}
      source={{ uri: post.preview?.images[0].source.url }}
    />
  );

  const Footer = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        margin: 16,
      }}
    >
      <Avatar
        source={{ uri: "https://i.pravatar.cc/80" }}
        style={{ marginRight: 8 }}
      />
      <Text category="s1">{post.author}</Text>
    </View>
  );

  return (
    <>
      <Card
        style={{ margin: 10 }}
        header={
          post?.preview?.images?.[0].source.url ? <ImageHeader /> : undefined
        }
        footer={<Footer />}
        onPress={onPress}
      >
        <Animated.View
          style={{
            flexDirection: "column",
            padding: 0,
            marginTop: 10,
            marginBottom: 20,
          }}
          entering={FadeIn?.delay?.(50)?.duration(300)}
        >
          <Text style={{ marginBottom: 8 }} category="h6">
            {post.title}
          </Text>
          <Text
            appearance="hint"
            category="c1"
          >{`Posted in ${post.subreddit_name_prefixed}`}</Text>
        </Animated.View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 170,
    width: "100%",
    marginVertical: -16,
    marginBottom: 0,
  },
});

export default PostItem;
