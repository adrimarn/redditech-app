import * as React from "react";
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
} from "@ui-kitten/components";
import { RenderProp } from "@ui-kitten/components/devsupport";
import { ImageProps, SafeAreaView, StyleSheet, View } from "react-native";
import { Filter } from "../components/Filter";
// import { ApiService } from "../services/apiService";
import { useAuthAccessToken } from "../contexts/AuthContext";

const Post = ({ navigation, route }: any) => {
  const [filter, setFilter] = React.useState<
    "new" | "hot" | "random" | "rising" | any | string
  >("new");
  const { accessToken } = useAuthAccessToken();
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackIcon: RenderProp<Partial<ImageProps>> = (props) => (
    <Icon {...props} name="arrow-back" />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  // React.useEffect(() => {
  //   console.log(filter);
  //   const fetchData = async () => {
  //     const res = await ApiService.getSubredditPosts(
  //       "anime",
  //       accessToken,
  //       filter
  //     );
  //     console.log(res);
  //   };
  //   fetchData();
  // }, [filter]);

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView>
        <TopNavigation
          title="Post"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />

        <Filter key={filter} filter={filter} setFilter={setFilter} />
        <View style={styles.viewPadding}>
          <Text>Post ID: {route.params.postID}</Text>
          <Text style={styles.textMargin}>
            This is a sample post for testing navigation.
          </Text>
          <Text>Please use this component to display the post.</Text>
          <Text style={styles.textMargin}>Thanks!</Text>
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
