import Toast from "react-native-toast-message";
import { CategoryItemProps } from "../components/CategoryItem";

/**
 * Fetches data from the specified URL with the provided token.
 * @param url The URL to fetch data from.
 * @param token The access token to use for authentication.
 * @returns A Promise that resolves to the fetched data.
 * @throws An error if there is a problem fetching the data.
 */
const fetchData = async (url: string, token?: string): Promise<any> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `bearer ${token}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    return response.json();
  } catch (error) {
    const errorMessage = `Error fetching data from ${url}: ${error}`;
    Toast.show({
      type: "error",
      text1: "An error has occurred",
      text2: "Please try again later.",
      position: "bottom",
    });
    throw new Error(errorMessage);
  }
};

export type UserDataType = {
  id: string;
  name: string;
  icon_img: string;
  subreddit: {
    public_description: string;
  };
};

export type UserPreferencesDataType = {
  accept_pms: string;
  email_messages: boolean;
  activity_relevant_ads: boolean;
  nightmode: boolean;
  mark_messages_read: boolean;
  highlight_controversial: boolean;
};

export type PostType = {
  id: string;
  title: string;
  author: string;
  subreddit?: string;
  subreddit_name_prefixed?: string;
  thumbnail: string;
  url: string;
  created_utc: Date;
};

export type dataInfoSubbredit = {
  data: {
    title: string;
    display_name_prefixed: string;
    subscribers: string;
    public_description: string;
    header_img: string;
    user_is_subscriber: string;
    id: string;
  };
};

export type SubRedditInformation = {
  data: {
    after: string;
    children: dataInfoSubbredit[];
  };
};

/**
 * Service that interacts with a Reddit API.
 */
export const ApiService = {
  /**
   * Gets user data using the provided token.
   * @param token The token to use for authentication.
   * @returns A Promise that resolves to the user data.
   */
  getUser: async (token: string): Promise<UserDataType> => {
    const url = "https://oauth.reddit.com/api/v1/me?raw_json=1";
    return await fetchData(url, token);
  },

  getUserPreferences: async (
    token: string
  ): Promise<UserPreferencesDataType> => {
    const url = "https://oauth.reddit.com/api/v1/me/prefs?raw_json=1";
    return await fetchData(url, token);
  },

  /**
   * Gets the user's subscribed posts using the provided token.
   * @param token The token to use for authentication.
   * @param limit The maximum number of posts to return.
   * @returns A Promise that resolves to an array of subscribed posts.
   */
  getSubscribedPosts: async (
    token: string,
    limit: number = 25
  ): Promise<PostType[]> => {
    const subreddits = await ApiService.getSubscribedSubreddits(token, limit);

    const posts = await Promise.all(
      subreddits.map(async (subreddit: string) => {
        const postsUrl = `https://oauth.reddit.com/r/${subreddit}/new?limit=${limit}`;
        const postsData = await fetchData(postsUrl, token);

        return postsData.data.children.map(
          ({ data }: any): PostType => ({
            id: data.id,
            title: data.title,
            author: data.author,
            subreddit_name_prefixed: data.subreddit_name_prefixed,
            url: data.url,
            thumbnail: ["self", "nsfw", "default"].includes(data.thumbnail)
              ? null
              : data.thumbnail,
            created_utc: new Date(data.created_utc * 1000),
          })
        );
      })
    );

    const flattenedPosts = posts.flat();

    // Sort posts by created_utc in descending order
    flattenedPosts.sort(
      (a: PostType, b: PostType) =>
        b.created_utc.getTime() - a.created_utc.getTime()
    );

    return flattenedPosts.slice(0, limit);
  },

  /**
   * Gets the user's subscribed subreddits using the provided token.
   * @param token The token to use for authentication.
   * @param limit The maximum number of subreddits to return.
   * @returns A Promise that resolves to an array of subscribed subreddits.
   */
  getSubscribedSubreddits: async (
    token: string,
    limit: number = 25
  ): Promise<any[]> => {
    const url = `https://oauth.reddit.com/subreddits/mine/subscriber?limit=${limit}`;
    return await fetchData(url, token);
  },

  /**
   * Checks if the provided token is valid.
   * @param token - The token to check.
   */
  validateToken: async (token: string): Promise<boolean> => {
    const url = "https://oauth.reddit.com/api/v1/me?raw_json=1";
    try {
      const response = await fetchData(url, token);
      return response.status !== 401;
    } catch (error) {
      return false;
    }
  },

  /**
   * Gets the user's subscribed subreddits using the provided token.
   * @param subredditName - The name of the subreddit to search for.
   */
  getSubRedditByName: async (
    subredditName: string | undefined,
    lastItem: string | undefined
  ) => {
    const url = `https://www.reddit.com/subreddits/search.json?q=${subredditName}${lastItem}`;
    return await fetchData(url);
  },

  /**
   * Subscribes to a subreddit using the provided token.
   *
   * @param subredditName - The name of the subreddit to subscribe to.
   * @param accessToken - The token to use for authentication.
   * @param action - The action to perform. Defaults to "sub".
   */
  subscribeToSubreddit: async (
    subredditName: string,
    accessToken: string,
    action: "sub" | "unsub" = "sub"
  ): Promise<any> => {
    const endpoint = `https://oauth.reddit.com/api/subscribe?sr_name=${subredditName}&action=${action}`;

    fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(`Erreur ${subredditName} : ${response.statusText}`);
        }
      })
      .catch((error) => console.error(error));
  },

  /**
   * Updates the user's preferences using the provided token and preferences.
   * @param token The token to use for authentication.
   * @param preferences The preferences to update.
   * @returns A Promise that resolves to the updated preferences.
   */
  updateUserPreferences: async (
    token: string,
    preferences: UserPreferencesDataType
  ): Promise<UserPreferencesDataType> => {
    const url = "https://oauth.reddit.com/api/v1/me/prefs";
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });
      return response.json();
    } catch (error) {
      const errorMessage = `Error patching data from ${url}: ${error}`;
      Toast.show({
        type: "error",
        text1: "An error has occurred",
        text2: "Please try again later.",
        position: "bottom",
      });
      throw new Error(errorMessage);
    }
  },

  /**
   * Gets a random list of subreddits.
   * @param limit The maximum number of subreddits to return.
   */
  getRandomSubreddits: async (
    limit: number = 20
  ): Promise<CategoryItemProps[]> => {
    try {
      const subreddits = await ApiService.getSubreddit();
      const randomIndexes = new Set<number>();
      while (randomIndexes.size < limit) {
        randomIndexes.add(Math.floor(Math.random() * subreddits.length));
      }
      return Array.from(randomIndexes).map((index) => subreddits[index]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Gets a list of subreddits.
   * @param limit The maximum number of subreddits to return.
   * @returns A Promise that resolves to an array of subreddits.
   */
  getSubreddit: async (limit: number = 100): Promise<CategoryItemProps[]> => {
    try {
      const url = `https://www.reddit.com/subreddits/popular.json?limit=${limit}`;
      const data = await fetchData(url);

      const {
        data: { children },
      } = data;

      return children.map(({ data }: any) => ({
        id: data.id,
        name: data.display_name_prefixed,
        description: data.public_description,
        subscribersCount: data.subscribers,
        url: data.url,
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * Gets the latest post thumbnail from the provided subreddit.
   * @param subreddit The subreddit to get the latest post thumbnail from.
   * @returns A Promise that resolves to the latest post thumbnail.
   */
  getLatestPostThumbnail: async (subreddit: string): Promise<string | null> => {
    try {
      const postsUrl = `https://www.reddit.com/r/${subreddit}/new.json?limit=20&raw_json=1`;
      const postsData = await fetchData(postsUrl);
      if (postsData.data.children.length > 0) {
        let foundThumbnail = null;
        for (let i = 0; i < postsData.data.children.length; i++) {
          const post = postsData.data.children[i];
          const previewImages = post.data.preview && post.data.preview.images;
          if (previewImages && previewImages.length > 0) {
            for (let j = 0; j < previewImages.length; j++) {
              const image = previewImages[j];
              const thumbnail = image.source && image.source.url;
              if (
                thumbnail &&
                !["self", "nsfw", "default"].includes(thumbnail)
              ) {
                foundThumbnail = thumbnail;
                break;
              }
            }
          }
          if (foundThumbnail) {
            break;
          }
        }
        return foundThumbnail;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  hasSubscribed: async (subredditName: string, accessToken: string) => {
    const url = `https://oauth.reddit.com/r/${subredditName.slice(2)}/about`;
    const response = await fetchData(url, accessToken);

    return response.data.user_is_subscriber;
  },
};
