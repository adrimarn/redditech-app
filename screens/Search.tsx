import React, { useState } from "react";
import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";
import { Layout, Input, Button } from "@ui-kitten/components";
import { ApiService } from "../services/apiService";
import { CategoryItem, CategoryItemProps } from "../components/CategoryItem";

const Search = ({ navigation }: any) => {
  const [subredditInput, setSubredditInput] = useState<string>();
  const [subRedditInfo, setSubRedditInfo] = useState<CategoryItemProps[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastSubRedditId, setLastSubRedditId] = React.useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSubRedditName, setLastSubRedditName] = React.useState<string>();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchSubReddit(true, true);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onInputChange = (value: string) => {
    setSubredditInput(value);
  };

  const handleSearch = async () => {
    await fetchSubReddit(true);
  };

  const fetchSubReddit = async (isReset = false, isRefresh = false) => {
    if (isLoading) return;
    setIsLoading(true);

    // Définir lastSubRedditId sur undefined si isReset est true
    const lastId = isReset ? undefined : lastSubRedditId;
    const lastName = isRefresh ? lastSubRedditName : subredditInput;

    const data = await ApiService.getSubRedditByName(
      lastName,
      undefined,
      lastId,
      10
    );

    setSubRedditInfo((prevState) => {
      if (prevState && !isReset) {
        return [...prevState, ...data];
      }
      return data;
    });
    setLastSubRedditId(data[data.length - 1].identifier);
    setLastSubRedditName(lastName);
    setIsLoading(false);
  };

  const onPress = (subreddit: CategoryItemProps) => {
    navigation.navigate("Posts", { subreddit });
  };

  const handleScrollEnd = async () => {
    await fetchSubReddit();
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <View>
          <Input
            style={styles.input}
            placeholder="Search a subbredit name"
            onChangeText={onInputChange}
            value={subredditInput}
          />
          <Button onPress={handleSearch}>Search</Button>
        </View>
        <FlatList
          data={subRedditInfo}
          renderItem={({ item, index }) => (
            <CategoryItem
              item={item}
              index={index}
              onPress={() => onPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={handleScrollEnd}
          onEndReachedThreshold={0.2}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </SafeAreaView>
    </Layout>
  );
};

export default Search;

const styles = StyleSheet.create({
  input: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  cardContainer: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 16,
    borderRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "center",
    marginHorizontal: 10,
  },
  icon: {
    width: "100%",
    height: 32,
    marginRight: 8,
    textAlign: "center",
    marginVertical: 10,
  },
  img: {
    width: 50,
    height: 50,
  },
  imgContainer: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
