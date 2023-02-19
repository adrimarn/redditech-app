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
      text2: errorMessage,
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
};
