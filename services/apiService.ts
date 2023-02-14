export type UserDataType = {
  id: string;
  name: string;
  snoovatar_img: string;
  icon_img: string;
  subreddit: {
    public_description: string
  }
};

const getUser = (token: string): Promise<UserDataType> => {
  return fetch(`https://oauth.reddit.com/api/v1/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  }).then((response) => response.json());
};

export const ApiService = {
  getUser,
};
