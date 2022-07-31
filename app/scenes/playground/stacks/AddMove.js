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

import { move_type, end_move } from "@/constants/options";
import { generateID } from "@/lib/utils";

const AddMove = ({ navigation, route }) => {
  const { edit, item, onSave, onDelete } = route.params;
  const { state } = useDeviceContext();

  const devices = state.devices.map((item, i) => {
    return {
      value: i,
      name: item.hw_get_info.name,
      description: `${item.hw_get_info.serial_number} - ${item.hw_get_info.path}`,
    };
  });

  const [values, setValues] = useState({
    id: edit ? item.id : generateID(),
    device: edit ? item.device : 0,
    relative: edit ? item.relative : 0,
    reset: edit ? item.reset : 0,
    dwell: edit ? item.dwell : 0,
    distance: edit ? item.distance : 0,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <CustomText {...props} variant="medium" style={tailwind("text-lg")}>
          {edit ? "Edit move" : "Add move"}
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
    <ScrollView style={tailwind("h-full px-6 bg-white")}>
      <View style={tailwind("mb-4")}>
        <CustomText variant="medium" style={tailwind("mb-2 text-gray-900")}>
          Devices
        </CustomText>
        <RadioGroup
          items={devices}
          selectedValue={values.device}
          onValueChange={(itemValue, _) => {
            setValues({ ...values, device: itemValue });
          }}
        />
      </View>
      <View style={tailwind("mb-4")}>
        <CustomText variant="medium" style={tailwind("mb-2 text-gray-900")}>
          Move type
        </CustomText>
        <RadioGroup
          items={move_type}
          selectedValue={values.relative}
          onValueChange={(itemValue, _) => {
            setValues({ ...values, relative: itemValue });
          }}
        />
      </View>
      <View style={tailwind("mb-4")}>
        <CustomText variant="medium" style={tailwind("mb-2 text-gray-900")}>
          End move
        </CustomText>
        <RadioGroup
          items={end_move}
          selectedValue={values.reset}
          onValueChange={(itemValue, _) => {
            setValues({ ...values, reset: itemValue });
          }}
        />
      </View>
      <View style={tailwind("mb-4")}>
        <CustomText variant="medium" style={tailwind(" p-2 text-gray-900")}>
          Distance (mm)
        </CustomText>
        <TextInput
          value={values.distance.toString()}
          style={tailwind(
            "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
          )}
          onChangeText={(text) => {
            setValues({ ...values, distance: text });
          }}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          maxLength={6}
        />
      </View>
      <View style={tailwind("mb-4")}>
        <CustomText variant="medium" style={tailwind("mb-2 text-gray-900")}>
          Dwell time (s)
        </CustomText>
        <TextInput
          value={values.dwell.toString()}
          style={tailwind(
            "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
          )}
          onChangeText={(text) => {
            setValues({ ...values, dwell: text });
          }}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          maxLength={6}
        />
      </View>
      <View style={tailwind("flex-row flex self-end my-8")}>
        {edit ? (
          <TouchableOpacity
            style={tailwind("py-2 px-4 rounded-xl bg-red-500 mr-2")}
            onPress={() => {
              onDelete(values.id);
              navigation.goBack();
            }}
          >
            <CustomText
              variant="medium"
              style={tailwind("text-white text-2xl text-center")}
            >
              DELETE
            </CustomText>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={tailwind("py-2 px-4 rounded-xl bg-purple-500")}
          onPress={() => {
            onSave(values);
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
  );
};

export default AddMove;
