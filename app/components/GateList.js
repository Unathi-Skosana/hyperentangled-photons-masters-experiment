import React from "react";
import { View, Platform } from "react-native";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;
import tailwind from "tailwind-rn";
import Gates from "@/components/Gates";

const GateList = (props) => {
  const { items, selectedGate, onValueChange } = props;

  return (
    <View style={tailwind("flex flex-row flex-wrap items-center")}>
      {items.map((item, index) => {
        const Item = Gates[item.value];

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => {
              onValueChange(item.value, index);
            }}
          >
            <Item
              style={tailwind(
                `${
                  item.value === selectedGate
                    ? "border-4 border-yellow-400 rounded-md"
                    : ""
                }`
              )}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default GateList;
