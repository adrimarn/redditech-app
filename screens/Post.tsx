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

const Post = ({ navigation, route }: any) => {
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackIcon: RenderProp<Partial<ImageProps>> = (props) => (
    <Icon {...props} name="arrow-back" />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
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
