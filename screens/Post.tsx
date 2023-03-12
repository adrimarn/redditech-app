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
import { Feather } from "@expo/vector-icons";

interface Comment {
  id: string;
  body: string;
  replies?: Comment[];
  user: {
    avatarUrl: string;
  };
  data: Comment;
}

const ArrowUp: RenderProp<Partial<ImageProps>> = (props) => (
  <Feather {...props} name="arrow-up" size={24} color="#ff4500" />
);

const ArrowDown: RenderProp<Partial<ImageProps>> = (props) => (
  <Feather {...props} name="arrow-down" size={24} color="#ff4500" />
);

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

  const changeFormatDate = (date: string) => {
    let startDay = new Date(date).getDate();
    let startMonth = new Date(date).getMonth();
    let startYear = new Date(date).getFullYear();
    return (
      <Text style={styles.date}>
        <Text style={styles.dateLabel}>Date:</Text>
        {startDay}/{startMonth}/{startYear}
      </Text>
    );
  };

  const DisplayImageBackGroundPost = () => {
    return (
      <>
        {post.preview ? (
          <View>
            <ImageBackground
              style={styles.imagePost}
              source={{ uri: post.preview?.images[0].source.url as string }}
            ></ImageBackground>
          </View>
        ) : (
          ""
        )}
      </>
    );
  };
  const PostHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.authorView}>
          <Text style={styles.author}>
            Posted by
            <Text style={styles.authorName}>{post.author}</Text>
          </Text>
          {changeFormatDate(post.created_utc.toDateString())}
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.votes}>
          <View style={styles.number}>
            <Text>{post.ups}</Text>
            <ArrowUp />
          </View>
          <View style={styles.number}>
            <Text>{post.downs}</Text>
            <ArrowDown />
          </View>
        </View>
        <DisplayImageBackGroundPost />
      </View>
    );
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={post.subreddit_name_prefixed}
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
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    height: 250,
  },
  title: {
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
  },
  authorView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  author: {
    marginVertical: 1,
    fontWeight: "bold",
    fontSize: 10,
    margin: 10,
  },
  authorName: {
    marginHorizontal: 50,
    fontWeight: "bold",
    fontSize: 10,
    color: theme["color-primary-500"],
  },
  postedBy: {
    color: theme["color-primary-500"],
    fontWeight: "100",
  },
  imageTitleSubReddit: {
    paddingVertical: 2,
    color: theme["color-primary-500"],
  },
  date: {
    marginHorizontal: 10,
    color: theme["color-primary-500"],
    fontSize: 10,
    fontWeight: "bold",
  },
  dateLabel: {
    fontSize: 10,
  },
  votes: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  number: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});
