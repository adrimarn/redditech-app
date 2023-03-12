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
import React, { useEffect, useState } from "react";
import { ImageProps, SafeAreaView, StyleSheet, View } from "react-native";
import { useAuthAccessToken } from "../contexts/AuthContext";
import { ApiService } from "../services/apiService";

interface Comment {
  id: string;
  body: string;
  replies?: Comment[];
  author: string;
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
          <UserAvatar size="small" author={comment.author} />
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
                <UserAvatar size="small" author={reply.author} />
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

const UserAvatar = (props: any) => {
  const [avatar, setAvatar] = React.useState<string | undefined>();
  useEffect(() => {
    async function getAvatar() {
      try {
        const avatarUrl = await ApiService.getUserAvatar(props.author);
        setAvatar(avatarUrl);
      } catch (error) {
        console.log(error);
      }
    }
    getAvatar();
  }, []);
  return <Avatar source={{ uri: avatar }} {...props} />;
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
