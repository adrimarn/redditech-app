import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
  List,
  ListItem,
  Avatar,
} from "@ui-kitten/components";
import { RenderProp } from "@ui-kitten/components/devsupport";
import { useEffect, useState } from "react";
import {
  ImageProps,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ImageBackground,
} from "react-native";
import { PostType } from "../components/PostItem";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { ApiService } from "../services/apiService";
import theme from "../adrimarn-theme.json";

interface Comment {
  id: string;
  body: string;
  replies?: Comment[];
  user: {
    avatarUrl: string;
  };
  data: Comment;
}

const Post = ({ navigation, route }: any) => {
  const { accessToken } = useAuthAccessToken();
  const { post }: { post: PostType } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackIcon: RenderProp<Partial<ImageProps>> = (props) => (
    <Icon {...props} name="arrow-back" />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const data = await ApiService.getCommentaries(
          accessToken,
          route.params.post.permalink
        );

        const postComments = data[1].data.children;

        const comments = postComments.map((comment: any) => ({
          ...comment.data,
          replies: comment.data.replies?.data?.children || [],
        }));

        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComment();
  }, []);

  const renderCommentItem = ({ item: comment }: { item: Comment }) => (
    <>
      <ListItem
        title={comment.body}
        accessoryLeft={() => (
          <Avatar size="small" source={{ uri: "https://i.pravatar.cc/80" }} />
        )}
      />
      {comment.replies && (
        <List
          data={comment.replies}
          renderItem={({ item: { data: reply } }) => (
            <ListItem
              title={reply.body}
              style={{ paddingLeft: 40 }}
              accessoryLeft={() => (
                <Avatar
                  size="small"
                  source={{ uri: "https://i.pravatar.cc/80" }}
                />
              )}
            />
          )}
        />
      )}
    </>
  );

  useEffect(() => {
    console.log(post);
  }, []);

  const DisplayImageBackGroundPost = () => {
    return (
      <View>
        <ImageBackground
          style={styles.imagePost}
          source={{ uri: post.preview?.images[0].source.url as string }}
        />
        <View>
          <Text style={styles.title}>{post.title}</Text>
        </View>
      </View>
    );
  };
  const PostHeader = () => {
    return (
      <View style={styles.header}>
        <DisplayImageBackGroundPost />
        <View style={styles.author}>
          <Text style={styles.authorText}>{post.author}</Text>
        </View>
      </View>
    );
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView>
        <TopNavigation
          title="Post"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <View>
          <PostHeader />
        </View>
        <Divider />
        <List
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(comment) => comment.id.toString()}
        />
      </SafeAreaView>
    </Layout>
  );
};

export default Post;

const styles = StyleSheet.create({
  viewPadding: {
    padding: 20,
  },
  textMargin: {
    marginTop: 30,
  },
  header: {
    marginBottom: 20,
  },
  imagePost: {
    margin: 0,
    padding: 0,
    width: "100%",
    height: 200,
    opacity: 0.4,
  },
  author: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  authorText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    marginTop: 10,
    color: theme["color-primary-500"],
    textAlign: "center",
  },
});
