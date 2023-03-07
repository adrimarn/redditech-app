import React from "react";
import { GestureResponderEvent, StyleSheet } from "react-native";
import { Button, Layout } from "@ui-kitten/components";

const buttons = [
  {
    title: "BEST",
    value: "hot",
    disabled: false,
  },
  {
    title: "CONTROVERSIAL",
    value: "rising",
    disabled: false,
  },
  {
    title: "NEW",
    value: "new",
    disabled: false,
  },
  {
    title: "RANDOM",
    value: "random",
    disabled: false,
  },
];

interface ButtonsProps {
  filter: "new" | "hot" | "rising" | "random";
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const Filter = (props: ButtonsProps) => {
  return (
    <Layout style={styles.container} level="1">
      {buttons.map((button) => {
        return (
          <Button
            onPress={() => props.setFilter(button.value)}
            style={styles.button}
            size="small"
            key={button.title}
            disabled={button.disabled}
          >
            {button.title}
          </Button>
        );
      })}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  button: {
    marginHorizontal: 5,
    marginTop: 15,
    borderRadius: 20,
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    padding: 6,
    justifyContent: "center",
    backgroundColor: "#3366FF",
  },
});
