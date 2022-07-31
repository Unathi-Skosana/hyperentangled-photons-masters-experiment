import React from "react";
import { View, Platform } from "react-native";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;

import tailwind from "tailwind-rn";

import CustomText from "./CustomText";

const Stepper = (props) => {
  const { value, onValueChange, min = 0, max = 100, step = 2 } = props;

  const increment = () => {
    const inc = value + step;
    if (inc <= max) {
      onValueChange(inc);
    } else {
      onValueChange(max);
    }
  };

  const decrement = () => {
    const dec = value - step;
    if (dec >= min) {
      onValueChange(dec);
    } else {
      onValueChange(min);
    }
  };

  return (
    <View
      style={[
        tailwind("flex flex-row w-full h-16 items-center relative"),
        props.style,
      ]}
    >
      <View style={tailwind("flex-grow")}>
        <TouchableOpacity
          onPress={decrement}
          style={tailwind(
            "bg-indigo-700 bg-opacity-75 h-full rounded-l-xl flex flex-col justify-center"
          )}
        >
          <CustomText style={tailwind("text-white text-4xl text-left ml-6")}>
            &minus;
          </CustomText>
        </TouchableOpacity>
      </View>
      <View
        style={tailwind(
          "absolute left-1/2 z-10 h-full flex flex-col justify-center items-center bg-white rounded-full w-16 -ml-8"
        )}
      >
        <CustomText
          variant="medium"
          style={tailwind("text-2xl tracking-tighter text-indigo-600")}
        >
          {value}
        </CustomText>
      </View>
      <View style={tailwind("flex-grow")}>
        <TouchableOpacity
          onPress={increment}
          style={tailwind(
            "bg-indigo-700 bg-opacity-75 h-full rounded-r-xl flex flex-col justify-center"
          )}
        >
          <CustomText style={tailwind("text-white text-4xl text-right mr-6")}>
            &#43;
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Stepper;
