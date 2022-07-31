import React, { useRef } from "react";
import { ScrollView, SafeAreaView, View, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";

import tailwind from "tailwind-rn";

import BarChart from "@/components/BarChart";
import CustomText from "@/components/CustomText";

import { Table, Row, Rows } from "@/components/Table";

const N = 8;
const data = [
  {
    id: 245674,
    value: 0.5,
  },
  {
    id: 245675,
    value: 0.17,
  },
  {
    id: 245676,
    value: 0.1,
  },
  {
    id: 245677,
    value: 0.1,
  },
  {
    id: 245678,
    value: 0.1,
  },
  {
    id: 245679,
    value: 0.1,
  },

  {
    id: 245680,
    value: 0.1,
  },

  {
    id: 2456781,
    value: 0.17,
  },
];

const PlaygroundScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={tailwind("h-full px-4 bg-white mb-20")}>
      <View style={tailwind("items-start mb-4")}>
        <CustomText style={tailwind("text-2xl")}>Playground</CustomText>
        <View style={tailwind("w-full mt-4")}>
          <Table>
            <Row
              styles={{
                containerStyle: tailwind(
                  "p-2 top-0 border-b border-gray-200 bg-gray-100"
                ),
              }}
              data={["N", "Counts"]}
            />
            <Rows
              styles={{
                containerStyle: tailwind(
                  "p-2 border-dashed border-t border-gray-200"
                ),
              }}
              data={[
                ["0", "100"],
                ["1", "200"],
              ]}
            />
          </Table>
        </View>
      </View>

      {/*
          <View
            style={tailwind(
              "border-4 h-64 border-gray-200 border-dashed rounded-xl mb-4 flex justify-center items-center"
            )}
          >
            <CustomText variant="medium" style={tailwind("text-lg")}>
              Bell's inequality
            </CustomText>
          </View>
          <View
            style={tailwind(
              "border-4 h-64 border-gray-200 border-dashed rounded-xl flex justify-center items-center mb-4"
            )}
          >
            <CustomText variant="medium" style={tailwind("text-lg")}>
              Witness measurement
            </CustomText>
          </View>
          <View
            style={tailwind(
              "border-4 h-64 border-gray-200 border-dashed rounded-xl flex justify-center items-center"
            )}
          >
            <CustomText variant="medium" style={tailwind("text-lg")}>
              Witness measurement
            </CustomText>
        </View>*/}
    </SafeAreaView>
  );
};

export default PlaygroundScreen;
