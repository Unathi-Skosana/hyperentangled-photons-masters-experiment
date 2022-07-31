import React from "react";
import { StyleSheet, View } from "react-native";
import { scaleLinear } from "d3-scale";

import tailwind from "tailwind-rn";

import CustomText from "@/components/CustomText";

const ROW_HEIGHT = 16;
const Underlay = ({ minY, maxY, step, points }) => {
  const scaleFormater = scaleLinear()
    .domain([0, ROW_HEIGHT]) // where height is the higher bar height in pixel
    .range([0, maxY]);
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={tailwind("flex flex-1 justify-between")}>
        {[1.0, 0.66, 0.33, 0.0].map((t) => {
          return (
            <View
              key={t}
              style={[
                tailwind("flex flex-row items-center"),
                {
                  height: ROW_HEIGHT,
                  top: t === 0 ? ROW_HEIGHT / 2 : t === 1 ? -ROW_HEIGHT / 2 : 0,
                },
              ]}
            >
              <View style={tailwind("pr-2 w-10")}>
                <CustomText
                  variant="medium"
                  style={tailwind("text-black text-right")}
                >
                  {Number(scaleFormater(t * ROW_HEIGHT)).toFixed(2)}
                </CustomText>
              </View>
              <View
                style={[
                  tailwind("flex-1 bg-gray-200"),
                  {
                    height: 1,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={tailwind("flex flex-row items-center ml-10 h-8")}>
        {new Array(points).fill(0).map((_, i) => (
          <View key={i} style={{ width: step }}>
            <CustomText
              variant="medium"
              style={tailwind("text-center text-black")}
            >
              {i}
            </CustomText>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Underlay;
