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

export type PostType = {
  id: string;
  title: string;
  author: string;
  subreddit_name_prefixed: string;
  thumbnail: string;
  url: string;
  created_utc: number;
};

export type dataInfoSubbredit = {
  data: {
    title: string;
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

export interface RedditApiResponse {
  kind: string;
  data: {
    after: string | null;
    dist: number;
    modhash: string | null;
    geo_filter: string;
    children: Array<{
      kind: string;
      data: {
        name: string;
        display_name: string;
      };
    }>;
  };
}

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
  getSubReddit: async (subredditName: string) => {
    const url = `https://www.reddit.com/subreddits/search.json?q=${subredditName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    console.log(res);
    return res;
  },

  getSubscridedSubReddit: async (token: string) => {
    const url = "https://oauth.reddit.com/subreddits/mine/subscriber";
    const data = await fetchData(url, token);

    return data;
  },

  subscribeToSubreddit: async (subredditName: string, accessToken: string) => {
    console.log(subredditName);
    const url = `https://oauth.reddit.com/r/${subredditName}/api/subscribe`;
    const data = { action: "sub" };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log(res);
    return res;
  },
};
