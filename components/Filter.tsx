import React from "react";
import { StyleSheet } from "react-native";
import { Button, Layout } from "@ui-kitten/components";

export interface ButtonsProps {
  filter: "new" | "hot" | "rising" | "top";
  setFilter: (filter: ButtonsProps["filter"]) => void;
}

const buttons: { title: string; value: ButtonsProps["filter"] }[] = [
  {
    title: "Hot",
    value: "hot",
  },
  {
    title: "New",
    value: "new",
  },
  {
    title: "Top",
    value: "top",
  },
  {
    title: "Rising",
    value: "rising",
  },
];

export const Filter = (props: ButtonsProps) => {
  return (
    <Layout style={styles.container} level="1">
      {buttons.map((button) => {
        return (
          <Button
            onPress={() => props.setFilter(button.value)}
            style={styles.button}
            size="small"
            status={button.value === props.filter ? "primary" : "control"}
            appearance={button.value === props.filter ? "filled" : "outline"}
            key={button.title}
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
    borderWidth: 0,
    borderColor: "transparent",
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    padding: 6,
    justifyContent: "center",
    backgroundColor: "#3366FF",
  },
});
