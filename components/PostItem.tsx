import React from "react";
import { Card, Text, Avatar } from "@ui-kitten/components";
import { Image, StyleSheet, View } from "react-native";

export type PostType = {
  id: string;
  title: string;
  author: string;
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

const PostItem = ({ post }: { post: PostType }) => {
  const ImageHeader = () => (
    <Image
      style={styles.image}
      source={{ uri: post?.preview?.images?.[0].source.url }}
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
      <Card style={{ margin: 10 }} header={<ImageHeader />} footer={<Footer />}>
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
          <Text
            appearance="hint"
            category="c1"
          >{`Posted in ${post.subreddit_name_prefixed}`}</Text>
        </View>
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
  imageStyle: {
    //borderRadius: 8,
  },
});

export default PostItem;
