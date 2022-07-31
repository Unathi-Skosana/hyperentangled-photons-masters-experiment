import React, { useState, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { View, Animated, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";
import CustomText from "@/components/CustomText";

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
        toValue: appear ? 150 : 0,
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

  return (
    <Animated.View
      style={[{ height: heightAnim, opacity: fadeAnim, marginBottom: 10 }]}
    >
      <TouchableOpacity onPress={() => onClick()}>
        <View
          style={tailwind(
            "flex flex-col items-start px-6 py-2 rounded-xl bg-opacity-20 h-full bg-gray-200 bg-opacity-40"
          )}
        >
          <View style={tailwind("self-end")}>
            <CustomText variant="medium" style={tailwind("text-lg")}>
              #{index + 1}
            </CustomText>
          </View>

          <View style={tailwind("mb-2")}>
            <CustomText variant="medium" style={tailwind("text-lg")}>
              {data.device}
            </CustomText>
          </View>
          <View
            style={[
              tailwind("flex flex-row items-start justify-between w-full"),
            ]}
          >
            <View>
              <View
                style={tailwind(
                  "flex flex-row items-center bg-blue-200 px-3 py-1 rounded-full mb-2"
                )}
              >
                <Svg
                  style={tailwind("h-5 w-5 text-blue-800")}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <Path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <Path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </Svg>
                <CustomText variant="medium" style={tailwind("text-blue-800")}>
                  {data.distance} mm
                </CustomText>
              </View>

              <View
                style={tailwind(
                  "flex flex-row items-center bg-indigo-500 bg-opacity-30 px-3 py-1 rounded-full"
                )}
              >
                <Svg
                  style={tailwind("h-5 w-5 text-indigo-800")}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <Path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </Svg>
                <CustomText
                  variant="medium"
                  style={tailwind("text-indigo-800")}
                >
                  {data.dwell} s
                </CustomText>
              </View>
            </View>
            <View>
              <View
                style={tailwind(
                  `flex flex-row items-center ${
                    data.relative == 1 ? "bg-green-500" : "bg-red-500"
                  } bg-opacity-30 px-3 py-1 rounded-full mb-2`
                )}
              >
                {data.relative == 1 ? (
                  <Svg
                    style={tailwind("h-5 w-5  text-green-800")}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <Path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </Svg>
                ) : (
                  <Svg
                    style={tailwind("h-5 w-5 text-red-800")}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <Path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </Svg>
                )}
                <CustomText
                  variant="medium"
                  style={tailwind(
                    `${data.relative == 1 ? "text-green-800" : "text-red-800"}`
                  )}
                >
                  Relative
                </CustomText>
              </View>
              <View
                style={tailwind(
                  `flex flex-row items-center ${
                    data.reset == 1 ? "bg-green-500" : "bg-red-500"
                  } bg-opacity-30 px-3 py-1 rounded-full`
                )}
              >
                {data.reset == 1 ? (
                  <Svg
                    style={tailwind("h-5 w-5  text-green-800")}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <Path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </Svg>
                ) : (
                  <Svg
                    style={tailwind("h-5 w-5 text-red-800")}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <Path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </Svg>
                )}
                <CustomText
                  variant="medium"
                  style={tailwind(
                    `${data.reset === 1 ? "text-green-800" : "text-red-800"}`
                  )}
                >
                  Reset
                </CustomText>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedListItem;
