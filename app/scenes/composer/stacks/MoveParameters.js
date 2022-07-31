import React, { useLayoutEffect, useState } from "react";
import { ScrollView, View, TextInput, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;

import tailwind from "tailwind-rn";

import CustomText from "@/components/CustomText";

import { useDeviceContext } from "@/context/DeviceContext";

const MoveParameters = ({ navigation, route }) => {
  const { onStart } = route.params;

  const [values, setValues] = useState({
	cycles: 1,
	rounds: 2,
	dwell: 0,
	period: 10,
	acquire: 1,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <CustomText {...props} variant="medium" style={tailwind("text-lg")}>
          Move Parameters
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
      <ScrollView style={tailwind("h-full px-6 bg-white")}>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Cycles
          </CustomText>
          <TextInput
            value={values.cycles.toString()}
            style={tailwind(
              "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
            )}
            onChangeText={(text) => {
              setValues({ ...values, cycles: text });
            }}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
		<View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Rounds
          </CustomText>
          <TextInput
            value={values.rounds.toString()}
            style={tailwind(
              "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
            )}
            onChangeText={(text) => {
              setValues({ ...values, rounds: text });
            }}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
        <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
            Dwell (s)
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
            maxLength={3}
          />
        </View>
	    <View style={tailwind("mb-4")}>
          <CustomText variant="medium" style={tailwind("mb-2")}>
          	Period (s)
          </CustomText>
          <TextInput
            value={values.period.toString()}
            style={tailwind(
              "w-full rounded-xl border-2 font-medium text-lg p-5 border-indigo-400"
            )}
            onChangeText={(text) => {
              setValues({ ...values, period: text });
            }}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
        <View style={tailwind("flex-row flex self-end my-8")}>
          <TouchableOpacity
            style={tailwind("py-2 px-4 rounded-xl bg-purple-500")}
            onPress={async () => {
				navigation.goBack();
				await onStart(parseInt(values.cycles), parseInt(values.acquire),
					parseInt(values.period), parseInt(values.rounds), parseInt(values.dwell))
            }}
          >
            <CustomText
              variant="medium"
              style={tailwind("text-white text-2xl text-center")}
            >
              START
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default MoveParameters;
