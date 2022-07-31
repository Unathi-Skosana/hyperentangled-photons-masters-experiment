import React from "react";
import { SafeAreaView, FlatList, View, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import tailwind from "tailwind-rn";

import { useDeviceContext } from "@/context/DeviceContext";

import CustomText from "@/components/CustomText";

const DashboardScreen = ({ navigation }) => {
  const { state } = useDeviceContext();

  return (
    <SafeAreaView style={tailwind("h-full p-6 bg-white")}>
      <View style={tailwind("items-start mb-4")}>
        <CustomText style={tailwind("text-2xl")}>Discovered devices</CustomText>
      </View>
      <View style={tailwind("flex flex-col")}>
        <FlatList
          keyExtractor={(_, i) => i.toString()}
          data={state.devices.filter((_, i) => {
            return i != 4;
          })}
          renderItem={({ item, index }) => {
            if (typeof item === "undefined") return null;
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings", index)}
              >
                <View style={tailwind("flex flex-row mb-4")}>
                  <View
                    style={tailwind(
                      "items-center flex p-6 flex-row bg-gray-200 bg-opacity-40 flex-1 rounded-xl"
                    )}
                  >
                    <View
                      style={tailwind(
                        "flex flex-col items-start justify-between px-2 flex-1"
                      )}
                    >
                      <View style={tailwind("mb-4")}>
                        <CustomText variant="medium">
                          {item["hw_get_info"].name}
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
                          Status
                        </CustomText>
                        <View>
                          <Svg
                            style={tailwind(
                              `h-3 w-3 text-${
                                item["mot_get_dcstatusupdate"].motor_connected
                                  ? "green"
                                  : "red"
                              }-400`
                            )}
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
                          Path
                        </CustomText>
                        <CustomText
                          variant="regular"
                          style={tailwind("text-gray-500 text-xs")}
                        >
                          {item["hw_get_info"].path}
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
                          Serial number
                        </CustomText>
                        <CustomText
                          variant="regular"
                          style={tailwind("text-gray-500 text-xs")}
                        >
                          {item["hw_get_info"].serial_number}
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
                          {"v" + item["hw_get_info"].hw_version}
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
                          {"v" + item["hw_get_info"].firmware_version.join(".")}
                        </CustomText>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
