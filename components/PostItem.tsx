import React, { useEffect } from "react";
import { Text, Avatar } from "@ui-kitten/components";
import {
  Image,
  ImageProps,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ApiService } from "../services/apiService";
import { RenderProp } from "@ui-kitten/components/devsupport";
import { Feather } from "@expo/vector-icons";
import theme from "../adrimarn-theme.json";

export type PostType = {
  id: string;
  name: string;
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
  created_utc: Date;
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

  const Footer = () => {
    const ArrowUp: RenderProp<Partial<ImageProps>> = (props) => (
      <Feather
        {...props}
        name="arrow-up"
        size={24}
        color={theme["color-primary-500"]}
      />
    );

    const ArrowDown: RenderProp<Partial<ImageProps>> = (props) => (
      <Feather {...props} name="arrow-down" size={24} color="#15eabd" />
    );

    const Comments: RenderProp<Partial<ImageProps>> = (props) => (
      <Feather
        {...props}
        name="message-circle"
        size={24}
        color={theme["color-basic-100"]}
        style={{transform: [{rotateY: '180deg'}]}}
      />
    );
    return (
      <View style={styles.votes}>
        <View style={styles.number}>
          <ArrowUp />
          <Text style={{ marginLeft: 5 }}>{post.ups}</Text>
        </View>
        <View style={styles.number}>
          <ArrowDown />
          <Text style={{ marginLeft: 5 }}>{post.downs}</Text>
        </View>
        <View style={styles.number}>
          <Comments />
          <Text style={{ marginLeft: 5 }}>{post.num_comments}</Text>
        </View>
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
              post?.selftext != "" && (
                <Text style={{ marginVertical: 20 }}>
                  {post.selftext.slice(0, 100)}...
                </Text>
              )
            )}
            <Text
              appearance="hint"
              category="c1"
            >{`Posted in ${post.subreddit_name_prefixed}`}</Text>
          </View>
          <Footer />
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
  votes: {
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
  },
  number: {
    display: "flex",
    marginRight: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default PostItem;
