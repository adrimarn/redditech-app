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
import {
  ImageProps,
  SafeAreaView,
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
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
  author: string;
  data: Comment;
}

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
  />
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

  const changeFormatDate = (date: number) => {
    let startDay = new Date(date * 1000).getDate();
    let startMonth = new Date(date * 1000).getMonth();
    let startYear = new Date(date * 1000).getFullYear();
    return `${startDay}/${startMonth}/${startYear}`;
  };

  const DisplayImageBackGroundPost = () => {
    return (
      <>
        {post.preview ? (
          <View style={styles.imageView}>
            <ImageBackground
              borderRadius={25}
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
            Posted by <Text style={styles.authorName}>u/{post.author}</Text>
          </Text>
          {post.created_utc && (
            <Text style={styles.date}>{changeFormatDate(post.created)}</Text>
          )}
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <DisplayImageBackGroundPost />
        {post.selftext && (
          <ScrollView>
            <Text
              style={{
                paddingHorizontal: 20,
                textAlign: "center",
                fontWeight: "300",
                fontSize: 14,
                marginVertical: 10,
              }}
            >
              {post.selftext}
            </Text>
          </ScrollView>
        )}
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
        <View style={{ backgroundColor: "#231f36" }}>
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
  header: {
    marginTop: 20,
    marginBottom: 10,
  },
  imageView: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  imagePost: {
    marginVertical: 10,
    paddingVertical: 50,
    paddingHorizontal: 50,
    width: 350,
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
    color: theme["color-basic-600"],
    fontSize: 10,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  votes: {
    marginTop: 5,
    marginLeft: 20,
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    //justifyContent: "space-around",
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
