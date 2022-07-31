import React, { useState } from "react";
import { View, Platform } from "react-native";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;
import Svg, { Path, Circle } from "react-native-svg";
import tailwind from "tailwind-rn";

import CustomText from "./CustomText";

const RadioGroup = (props) => {
  const { items, selectedValue, onValueChange } = props;

  return (
    <View>
      {items.map((item, index) => (
        <TouchableOpacity
          style={tailwind(
            `${
              item.value === selectedValue
                ? "bg-indigo-700 bg-opacity-80"
                : "bg-gray-200 bg-opacity-40"
            } flex flex-row items-center rounded-lg px-5 py-4 mb-2`
          )}
          key={item.value}
          onPress={() => {
            onValueChange(item.value, index);
          }}
        >
          <View
            style={tailwind(
              `${!item.value === selectedValue ? "opacity-0" : ""}`
            )}
          >
            <Svg viewBox="0 0 24 24" fill="none" style={tailwind("h-6 w-6")}>
              <Circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2" />
              <Path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View style={tailwind("flex flex-col ml-4")}>
            <CustomText
              style={tailwind(
                `${
                  item.value === selectedValue ? "text-white" : "text-gray-500"
                }`
              )}
            >
              {item.name}
            </CustomText>
            <CustomText
              style={tailwind(
                `${
                  item.value === selectedValue ? "text-white" : "text-gray-500"
                } text-xs`
              )}
            >
              {item.description}
            </CustomText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioGroup;
