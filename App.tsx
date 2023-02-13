import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./contexts/AuthContext";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from "./adrimarn-theme.json";
import { Router } from "./routes/Router";

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <AuthProvider>
        <Router />
        <StatusBar style="auto" />
      </AuthProvider>
    </ApplicationProvider>
  );
}
