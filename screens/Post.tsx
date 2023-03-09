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
import { ImageProps, SafeAreaView, StyleSheet, View } from "react-native";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { ApiService } from "../services/apiService";

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

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView>
        <TopNavigation
          title="Post"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <View style={styles.viewPadding}>
          <Text>permalink: {route.params.permalink}</Text>
          <Text style={styles.textMargin}>
            This is a sample post for testing navigation.
          </Text>
          <Text>Please use this component to display the post.</Text>
          <Text style={styles.textMargin}>Thanks!</Text>
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
});
