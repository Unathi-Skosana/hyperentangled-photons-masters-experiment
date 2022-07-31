import React, { useState, useEffect } from "react";
import { useHeaderHeight } from "@react-navigation/stack";
import { View, Animated, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const numX = 4;
const numY = 5;
const total = numX * numY;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.4,
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
});
export default function ProgressIndicator() {
  const headerHeight = useHeaderHeight();
  const init = Array(total)
    .fill(1)
    .map((x) => ({ r: new Animated.Value(1), a: new Animated.Value(1) }));
  const [anim, setAnim] = useState(init);

  useEffect(() => {
    const c = anim.map((v, i: number) => {
      const t = 400 + Math.random() * 300;
      const seq = Animated.parallel([
        Animated.sequence([
          Animated.timing(anim[i].r, {
            toValue: 3,
            duration: t - 50,
            useNativeDriver: false,
          }),
          Animated.timing(anim[i].r, {
            toValue: 1,
            duration: t,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(anim[i].a, {
            toValue: 0.1,
            duration: t - 50,
            useNativeDriver: false,
          }),
          Animated.timing(anim[i].a, {
            toValue: 1,
            duration: t,
            useNativeDriver: false,
          }),
        ]),
      ]);
      return Animated.loop(seq);
    });
    // console.log(c)
    Animated.parallel(c).start();
  }, []);

  let circles = [];
  const margin = 100 / numX;
  for (let x = 0; x < numX; x++) {
    for (let y = 0; y < numY; y++) {
      const i = y * numX + x;
      circles.push({
        x: (x + 0.5) * margin,
        y: y * margin,
        r: anim[i].r,
        a: anim[i].a,
      });
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          top: -1.0 * headerHeight,
        },
      ]}
    >
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        {circles.map((c) => (
          <AnimatedCircle
            key={c.y * numX + c.x}
            cx={c.x}
            cy={c.y}
            r={c.r}
            fill="white"
            opacity={c.a}
          />
        ))}
      </Svg>
    </View>
  );
}
