import React, { useLayoutEffect } from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import tailwind from "tailwind-rn";

import CustomText from "@/components/CustomText";

import { useDeviceContext } from "@/context/DeviceContext";
import {
  LIMIT_SWITCH,
  HOME_DIRECTION,
  JOG_MODE,
  JOG_STOP_MODE,
  POS_SCALE,
  VEL_SCALE,
  ACCEL_SCALE,
} from "@/constants/thorlabs_apt";

const SettingsScreen = ({ navigation, route }) => {
  const { state } = useDeviceContext();
  const index = route.params;
  const device = state.devices[index];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <CustomText {...props} variant="medium" style={tailwind("text-lg")}>
          {device["hw_get_info"].name}
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
    <SafeAreaView style={tailwind("h-full bg-white p-6")}>
      <View style={tailwind("mb-2")}>
        <CustomText variant="medium" style={tailwind("")}>
          Details
        </CustomText>
      </View>
      <View style={tailwind("flex flex-row justify-between mb-8")}>
        <View style={tailwind("w-1/2 pr-4")}>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Status
            </CustomText>
            <View>
              <Svg
                style={tailwind("h-3 w-3 text-green-400")}
                viewBox="0 0 8 8"
                fill="currentColor"
              >
                <Circle cx="4" cy="4" r="3" />
              </Svg>
            </View>
          </View>

          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Serial number
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {device["hw_get_info"].serial_number}
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Hardware version
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {"v" + device["hw_get_info"].hw_version}
            </CustomText>
          </View>
        </View>
        <View style={tailwind("w-1/2")}>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Homed
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {device["mot_get_dcstatusupdate"].homed ? "True" : "False"}
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Position
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_dcstatusupdate"].position / POS_SCALE
              ).toFixed(2)}{" "}
              mm
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Firmware version
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {"v" + device["hw_get_info"].firmware_version.join(".")}
            </CustomText>
          </View>
        </View>
      </View>
      <View style={tailwind("flex flex-row justify-between mb-2")}>
        <CustomText variant="medium" style={tailwind("")}>
          Home parameters
        </CustomText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home Parameters", index);
          }}
        >
          <CustomText variant="medium" style={tailwind("text-indigo-600")}>
            Edit
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={tailwind("flex flex-row justify-between mb-8")}>
        <View style={tailwind("w-1/2 pr-4")}>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Home direction
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {HOME_DIRECTION[device["mot_get_homeparams"].home_dir]}
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Limit switch
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {LIMIT_SWITCH[device["mot_get_homeparams"].limit_switch]}
            </CustomText>
          </View>
        </View>
        <View style={tailwind("w-1/2")}>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Offset distance
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_homeparams"].offset_distance / POS_SCALE
              ).toFixed(2)}{" "}
              mm
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Home velocity
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_homeparams"].home_velocity / VEL_SCALE
              ).toFixed(2)}{" "}
              mm s^-1
            </CustomText>
          </View>
        </View>
      </View>
      <View style={tailwind("flex flex-row justify-between mb-2")}>
        <CustomText variant="medium" style={tailwind("")}>
          Jog parameters
        </CustomText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Jog Parameters", index);
          }}
        >
          <CustomText variant="medium" style={tailwind("text-indigo-600")}>
            Edit
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={tailwind("flex flex-row justify-between mb-8")}>
        <View style={tailwind("w-1/2 pr-4")}>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Jog mode
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {JOG_MODE[device["mot_get_jogparams"].jog_mode]}
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Stop mode
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {JOG_STOP_MODE[device["mot_get_jogparams"].stop_mode]}
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Jog step size
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_jogparams"].step_size / POS_SCALE
              ).toFixed(2)}{" "}
              mm
            </CustomText>
          </View>
        </View>
        <View style={tailwind("w-1/2")}>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Minimum velocity
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_jogparams"].min_velocity / VEL_SCALE
              ).toFixed(2)}{" "}
              mm s^-1
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Maximum velocity
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_jogparams"].max_velocity / VEL_SCALE
              ).toFixed(2)}{" "}
              mm s^-1
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Acceleration
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_jogparams"].acceleration / ACCEL_SCALE
              ).toFixed(2)}{" "}
              mm s^-2
            </CustomText>
          </View>
        </View>
      </View>
      <View style={tailwind("flex flex-row justify-between mb-2")}>
        <CustomText variant="medium" style={tailwind("")}>
          Velocity parameters
        </CustomText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Velocity Parameters", index);
          }}
        >
          <CustomText variant="medium" style={tailwind("text-indigo-600")}>
            Edit
          </CustomText>
        </TouchableOpacity>
      </View>
      <View style={tailwind("flex flex-row justify-between mb-8")}>
        <View style={tailwind("w-1/2 pr-4")}>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Backlash distance
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_genmoveparams"].backlash_distance / POS_SCALE
              ).toFixed(2)}{" "}
              mm
            </CustomText>
          </View>

          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Minimum velocity
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_velparams"].min_velocity / VEL_SCALE
              ).toFixed(2)}{" "}
              mm s^-1
            </CustomText>
          </View>
        </View>
        <View style={tailwind("w-1/2")}>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Maximum velocity
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_velparams"].max_velocity / VEL_SCALE
              ).toFixed(2)}{" "}
              mm s^-1
            </CustomText>
          </View>
          <View
            style={tailwind(
              "flex flex-row items-center justify-between w-full"
            )}
          >
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              Acceleration
            </CustomText>
            <CustomText
              variant="regular"
              style={tailwind("text-gray-500 text-xs")}
            >
              {Number(
                device["mot_get_velparams"].acceleration / ACCEL_SCALE
              ).toFixed(2)}{" "}
              mm s^-2
            </CustomText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
