import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
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

  const printAllComments = (comment: any, parent: String) => {
    comment.map((subcomment: any, index: number) => {
      console.log("subcomment body:", subcomment.data.body);
      console.log("author du comment: ", subcomment.data.author);
      console.log("parent de ce subcomment: [", parent, "]");
      if (subcomment.data.replies) {
        printAllComments(
          subcomment.data.replies.data.children,
          subcomment.data.body
        );
      }
    });
  };

  useEffect(() => {
    const tibo = async () => {
      try {
        const data = await ApiService.getCommentaries(
          accessToken,
          route.params.post.permalink
        );
        console.log("JE COMMENCE LE FETCH");
        const postComments = data[1].data.children;
        console.log("postComments:", postComments)
        const comments: Comment[] = [];
        const commentReplies: { [parentId: string]: Comment[] } = {};

        for (let i = 0; i < postComments.length; i++) {
          const comment = postComments[i].data;
          comments.push(comment);

          const replies = comment.replies?.data?.children || [];
          for (let j = 0; j < replies.length; j++) {
            const reply = replies[j].data;
            commentReplies[reply.parent_id] =
              commentReplies[reply.parent_id] || [];
            commentReplies[reply.parent_id].push(reply);
          }
        }

        for (let i = 0; i < comments.length; i++) {
          const comment = comments[i];
          const commentId = comment.id;
          if (commentReplies[commentId]) {
            comment.replies = commentReplies[commentId];
          }
        }

        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };
    tibo();
  }, []);

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
        <View>
          {comments.map((comment) => (
            <View key={comment.id}>
              <Text>{comment.body}</Text>
              {comment.replies &&
                comment.replies.map((reply) => (
                  <View key={reply.id}>
                    <Text>{reply.body}</Text>
                  </View>
                ))}
            </View>
          ))}
        </View>
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
