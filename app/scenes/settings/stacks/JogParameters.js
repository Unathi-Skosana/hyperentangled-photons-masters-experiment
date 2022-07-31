import React, { useLayoutEffect, useState } from "react";
import { ScrollView, View, Platform, TextInput } from "react-native";
import Svg, { Path } from "react-native-svg";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;

import tailwind from "tailwind-rn";

import { useDeviceContext } from "@/context/DeviceContext";

import ProgressIndicator from "@/components/ProgressIndicator";
import CustomText from "@/components/CustomText";
import RadioGroup from "@/components/RadioGroup";

import { POS_SCALE, VEL_SCALE, ACCEL_SCALE } from "@/constants/thorlabs_apt";
import { jog_mode, stop_mode } from "@/constants/options";

const JogParameters = ({ navigation, route }) => {
  const { state, loading, putValues } = useDeviceContext();
  const index = route.params;
  const device = state.devices[index];
  const id = `devices[${index}].mot_get_jogparams`;

  const [values, setValues] = useState({
    jog_mode: device.mot_get_jogparams.jog_mode,
    stop_mode: device.mot_get_jogparams.stop_mode,
    step_size: Number(device.mot_get_jogparams.step_size / POS_SCALE).toFixed(
      2
    ),
    max_velocity: Number(
      device.mot_get_jogparams.step_size / VEL_SCALE
    ).toFixed(2),
    acceleration: Number(
      device.mot_get_jogparams.acceleration / ACCEL_SCALE
    ).toFixed(2),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <CustomText {...props} variant="medium" style={tailwind("text-lg")}>
          Jog Parameters
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
            Jog mode
          </CustomText>
          <RadioGroup
            items={jog_mode}
            selectedValue={values.jog_mode}
            onValueChange={(itemValue, _) => {
              setValues({ ...values, jog_mode: itemValue });
            }}
          />
        </View>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Stop mode
          </CustomText>
          <RadioGroup
            items={stop_mode}
            selectedValue={values.stop_mode}
            onValueChange={(itemValue, _) => {
              setValues({ ...values, stop_mode: itemValue });
            }}
          />
        </View>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Jog step size (mm)
          </CustomText>
          <TextInput
            value={values.step_size.toString()}
            style={tailwind(
              "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
            )}
            onChangeText={(text) => {
              setValues({ ...values, step_size: text });
            }}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
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
              await putValues("jog", index, id, values);
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

export default JogParameters;
