import React, { useState, useLayoutEffect } from "react";
import { ScrollView, View, Platform, TextInput } from "react-native";
import Svg, { Path } from "react-native-svg";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;

import tailwind from "tailwind-rn";

import { useDeviceContext } from "@/context/DeviceContext";

import CustomText from "@/components/CustomText";
import RadioGroup from "@/components/RadioGroup";
import ProgressIndicator from "@/components/ProgressIndicator";

import { POS_SCALE, VEL_SCALE } from "@/constants/thorlabs_apt";
import { home_direction, limit_switch } from "@/constants/options";

const HomeParameters = ({ navigation, route }) => {
  const index = route.params;
  const { state, loading, putValues } = useDeviceContext();
  const device = state.devices[index];
  const id = `devices[${index}].mot_get_homeparams`;

  const [values, setValues] = useState({
    home_dir: device.mot_get_homeparams.home_dir,
    limit_switch: device.mot_get_homeparams.limit_switch,
    offset_distance: Number(
      device.mot_get_homeparams.offset_distance / POS_SCALE
    ).toFixed(2),
    home_velocity: Number(
      device.mot_get_homeparams.home_velocity / VEL_SCALE
    ).toFixed(2),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <CustomText {...props} variant="medium" style={tailwind("text-lg")}>
          Home Parameters
        </CustomText>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={tailwind("ml-6")}
        >
          <Svg
            style={tailwind("h-6 w-6 text-gray-500")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </Svg>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <>
      {loading && <ProgressIndicator />}
      <ScrollView style={tailwind("h-full bg-white px-6")}>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Home direction
          </CustomText>
          <RadioGroup
            items={home_direction}
            selectedValue={values.home_dir}
            onValueChange={(itemValue, _) => {
              setValues({ ...values, home_dir: itemValue });
            }}
          />
        </View>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Limit switch
          </CustomText>
          <RadioGroup
            items={limit_switch}
            selectedValue={values.limit_switch}
            onValueChange={(itemValue, _) => {
              setValues({ ...values, limit_switch: itemValue });
            }}
          />
        </View>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Offset distance (mm)
          </CustomText>
          <TextInput
            value={values.offset_distance.toString()}
            style={tailwind(
              "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
            )}
            onChangeText={(text) => {
              setValues({ ...values, offset_distance: text });
            }}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            maxLength={6} //setting limit of input
          />
        </View>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Home velocity (mm s^-1)
          </CustomText>
          <TextInput
            style={tailwind(
              "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
            )}
            value={values.home_velocity.toString()}
            onChangeText={(text) => {
              setValues({ ...values, home_velocity: text });
            }}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            maxLength={6} //setting limit of input
          />
        </View>
        <View style={tailwind("flex-row flex self-end my-8")}>
          <TouchableOpacity
            style={tailwind("py-2 px-4 rounded-xl bg-purple-500")}
            onPress={async () => {
              await putValues("home", index, id, values);
              navigation.goBack();
            }}
          >
            <CustomText
              variant="medium"
              style={tailwind("text-white text-2xl text-center")}
            >
              SAVE
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default HomeParameters;
