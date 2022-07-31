import React from "react";
import { View } from "react-native";

import tailwind from "tailwind-rn";

import CustomText from "@/components/CustomText";

const Row = ({ data = [], styles = {} }) => {
  const { containerStyle = {}, entryStyle = {} } = styles;

  return (
    <View
      style={[
        containerStyle,
        tailwind("flex flex-row items-center justify-center"),
      ]}
    >
      {data.map((item, i) => (
        <View key={i} style={[entryStyle, tailwind("flex-grow")]}>
          <CustomText
            variant="medium"
            style={tailwind("text-gray-600 text-lg text-left")}
          >
            {item}
          </CustomText>
        </View>
      ))}
    </View>
  );
};

export default Row;
