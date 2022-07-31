import React from "react";
import { Dimensions, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import tailwind from "tailwind-rn";

import Underlay from "./Underlay";
import { lerp } from "./scale";

const { width: wWidth } = Dimensions.get("window");
const aspectRatio = 195 / 305;

const BarChart = ({ data, points }) => {
  const transition = useSharedValue(0);
  useFocusEffect(() => {
    transition.value = withTiming(1, { duration: 650 });
    return () => (transition.value = 0);
  });

  const canvasWidth = wWidth - 32 * 2;
  const canvasHeight = canvasWidth * aspectRatio;
  const width = canvasWidth - 32;
  const height = canvasHeight - 32;

  const step = width / points;
  const values = data.map((p) => p.value);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);

  return (
    <View style={tailwind("mt-8 pb-8 pl-10")}>
      <Underlay minY={minY} maxY={maxY} step={step} points={points} />
      <View style={{ width, height, overflow: "hidden" }}>
        {data.map((point, i) => {
          const totalHeight = lerp(0, height, point.value / maxY);
          const style = useAnimatedStyle(() => {
            const currentHeight = totalHeight * transition.value;
            const translateY = (totalHeight - currentHeight) / 2;
            return {
              transform: [{ translateY }, { scaleY: transition.value }],
            };
          });

          return (
            <Animated.View
              key={point.id}
              style={[
                style,
                {
                  position: "absolute",
                  left: i * step,
                  bottom: 0,
                  width: step,
                  height: totalHeight,
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: "rgba(17,148,170,1)",
                  opacity: 0.8,
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 3,
                  right: 3,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

export default BarChart;
