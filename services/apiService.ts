import Toast from "react-native-toast-message";

/**
 * Fetches data from the specified URL with the provided token.
 * @param url The URL to fetch data from.
 * @param token The access token to use for authentication.
 * @returns A Promise that resolves to the fetched data.
 * @throws An error if there is a problem fetching the data.
 */
const fetchData = async (url: string, token: string): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
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
  subreddit_name_prefixed: string;
  thumbnail: string;
  url: string;
  created_utc: number;
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
    const url = `https://oauth.reddit.com/subreddits/mine/subscriber?limit=${limit}`;
    const data = await fetchData(url, token);
    const subreddits = data.data.children.map(
      (child: any) => child.data.display_name
    );
    const posts = await Promise.all(
      subreddits.map(async (subreddit: string) => {
        const postsUrl = `https://oauth.reddit.com/r/${subreddit}/new?limit=${limit}`;
        const postsData = await fetchData(postsUrl, token);
        return postsData.data.children.map((child: any) => child.data);
      })
    );
    return posts.flat();
  },

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
};
