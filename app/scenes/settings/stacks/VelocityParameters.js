import React, { useLayoutEffect, useState } from "react";
import { ScrollView, View, TextInput, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;

import tailwind from "tailwind-rn";

import ProgressIndicator from "@/components/ProgressIndicator";
import CustomText from "@/components/CustomText";

import { useDeviceContext } from "@/context/DeviceContext";

import { VEL_SCALE, ACCEL_SCALE } from "@/constants/thorlabs_apt";

const VelocityParameters = ({ navigation, route }) => {
  const { state, loading, putValues } = useDeviceContext();
  const index = route.params;
  const device = state.devices[index];
  const id = `devices[${index}].mot_get_velparams`;

  const [values, setValues] = useState({
    max_velocity: Number(
      device.mot_get_velparams.max_velocity / VEL_SCALE
    ).toFixed(2),
    acceleration: Number(
      device.mot_get_velparams.acceleration / ACCEL_SCALE
    ).toFixed(2),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <CustomText {...props} variant="medium" style={tailwind("text-lg")}>
          Velocity Parameters
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
      <ScrollView style={tailwind("h-full px-6 bg-white")}>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Maximum velocity (mm s^-1)
          </CustomText>
          <TextInput
            value={values.max_velocity.toString()}
            style={tailwind(
              "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
            )}
            onChangeText={(text) => {
              setValues({ ...values, max_velocity: text });
            }}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Acceleration (mm s^-2)
          </CustomText>
          <TextInput
            value={values.acceleration.toString()}
            style={tailwind(
              "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
            )}
            onChangeText={(text) => {
              setValues({ ...values, acceleration: text });
            }}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
        <View style={tailwind("flex-row flex self-end my-8")}>
          <TouchableOpacity
            style={tailwind("py-2 px-4 rounded-xl bg-purple-500")}
            onPress={async () => {
              await putValues("velocity", index, id, values);
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

export default VelocityParameters;
