import React from "react";
import { Text, ActivityIndicator } from "react-native";
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

const CustomText = (props) => {
  const variants = {
    light: "Inter_300Light",
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    black: "inter_900Black",
  };

  let [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_900Black,
  });

  const { variant = "regular", ...rest } = props;

  if (fontsLoaded)
    return (
      <Text {...rest} style={[{ fontFamily: variants[variant] }, props.style]}>
        {props.children}
      </Text>
    );

  return <ActivityIndicator />;
};

export default CustomText;
