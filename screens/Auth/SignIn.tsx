import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import { useAuthAccessToken } from "../../contexts/AuthContext";
import { REDDIT_CLIENT_ID, REDDIT_REDIRECT_URI } from "@env";
import {
  Layout,
  Text,
  Button,
} from "@ui-kitten/components";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.reddit.com/api/v1/authorize",
  tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
};

export function SignIn() {
  const { setAccessToken } = useAuthAccessToken();
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: REDDIT_CLIENT_ID || "",
      scopes: ["identity", "mysubreddits", "read", "account", "subscribe"],
      redirectUri: makeRedirectUri({
        scheme: REDDIT_REDIRECT_URI || "",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setAccessToken(access_token);
    }
  }, [response]);

  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text category="h1">REDDITECH</Text>
      <Button
        style={{ marginTop: 20 }}
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        Login
      </Button>
    </Layout>
  );
}