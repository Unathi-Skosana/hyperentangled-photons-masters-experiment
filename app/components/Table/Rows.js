import React from "react";
import { View } from "react-native";

import Row from "./Row";

const Rows = ({ data = [], styles = {} }) => (
  <View>
    {data.map((row, i) => (
      <Row key={i} data={row} styles={styles} />
    ))}
  </View>
);

export default Rows;
