import React, { useState, useEffect } from "react";
import { View, Animated, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";
import CustomText from "@/components/CustomText";
import Gates from "@/components/Gates";

const AnimatedListItem = (props) => {
  //
  const { index, data, onClick } = props;

  // Start the opacity at 0
  const [fadeAnim] = useState(new Animated.Value(0));

  // Start the height at 0
  const [heightAnim] = useState(new Animated.Value(0));

  /**
   * Helper function for animating the item
   * @param appear - whether the animation should cause the item to appear or disappear
   * @param delay - how long the animation should last (ms)
   * @param callback - callback to be called when the animation finishes
   */
  const _animateItem = (appear = true, delay = 300, callback) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: appear ? 1 : 0,
        duration: delay,
        useNativeDriver: false,
      }),
      Animated.timing(heightAnim, {
        toValue: appear ? 180 : 0,
        duration: delay,
        useNativeDriver: false,
      }),
    ]).start(callback);
  };

  // Animate the appearance of the item appearing the first time it loads
  // Empty array in useEffect results in this only occuring on the first render
  useEffect(() => {
    _animateItem();
  }, []);

  // Reset an item to its original height and opacity
  // Takes a callback to be called once the reset finishes
  // The reset will take 0 seconds and then immediately call the callback.
  // const _reset = (callback) => {
  //_animateItem(true, 0, callback);
  //};

  // Deletes an item from the list. Follows the following order:
  // 1) Animate the item disappearing. On completion:
  // 2) Reset the item to its original display height (in 0 seconds). On completion:
  // 3) Call the parent to let it know to remove the item from the list
  //const _delete = () => {
  //_animateItem(false, 200, () => _reset(() => onDelete()));
  //};

  const { Q1, Q2, Q3 } = data;

  const Q1Proj = Gates[Q1];
  const Q2Proj = Gates[Q2];
  const Q3Proj = Gates[Q3];

  return (
    <Animated.View
      style={[{ height: heightAnim, opacity: fadeAnim, marginBottom: 10 }]}
    >
      <TouchableOpacity onPress={() => onClick()}>
        <View
          style={tailwind(
            "flex flex-col items-start px-6 py-4 rounded-xl bg-opacity-20 h-full bg-gray-200 bg-opacity-40"
          )}
        >
          <View style={tailwind("flex flex-row justify-between w-full mb-3")}>
            <View>
              <CustomText variant="medium" style={tailwind("text-lg")}>
                move id: {data.id}
              </CustomText>
            </View>
            <View>
              <CustomText variant="medium" style={tailwind("text-lg")}>
                #{index + 1}
              </CustomText>
            </View>
          </View>

          <View style={tailwind("flex flex-col items-start")}>
            <View style={tailwind("flex flex-row items-center")}>
              <CustomText variant="medium">Q1:</CustomText>
              <Q1Proj width={40} height={40} />
            </View>

            <View style={tailwind("flex flex-row items-center")}>
              <CustomText variant="medium">Q2:</CustomText>
              <Q2Proj width={40} height={40} />
            </View>

            <View style={tailwind("flex flex-row items-center")}>
              <CustomText variant="medium">Q3:</CustomText>
              <Q3Proj width={40} height={40} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedListItem;
