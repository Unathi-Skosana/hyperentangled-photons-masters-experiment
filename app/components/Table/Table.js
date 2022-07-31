import React from "react";
import { View } from "react-native";

const Table = (props) => {
  const { children, ...rest } = props;

  return <View {...rest}>{children}</View>;
};

export default Table;
