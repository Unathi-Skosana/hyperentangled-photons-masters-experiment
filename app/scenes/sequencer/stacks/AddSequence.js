import React, { useState, useLayoutEffect } from "react";
import { ScrollView, View, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;

import tailwind from "tailwind-rn";

import GateList from "@/components/GateList";
import CustomText from "@/components/CustomText";

import { generateID } from "@/lib/utils";

import { gates } from "@/constants/composer";

const AddMove = ({ navigation, route }) => {
  const { edit, item, onSave, onDelete } = route.params;

  const [operators, setOperators] = useState({
    id: edit ? item.id : generateID(),
    Q1: edit ? item.Q1 : "0",
    Q2: edit ? item.Q2 : "0",
    Q3: edit ? item.Q3 : "0",
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
        <View style={tailwind("mb-2")}>
          <CustomText variant="medium" style={tailwind("text-xl")}>
            Q1 (Polarization)
          </CustomText>
        </View>
        <GateList
          items={gates}
          selectedGate={operators.Q1}
          onValueChange={(item, _) =>
            setOperators({
              ...operators,
              Q1: item,
            })
          }
        />
      </View>

      <View style={tailwind("mb-4")}>
        <View style={tailwind("mb-2")}>
          <CustomText variant="medium" style={tailwind("text-xl")}>
            Q2 (Path)
          </CustomText>
        </View>
        <GateList
          items={gates}
          selectedGate={operators.Q2}
          onValueChange={(item, _) =>
            setOperators({
				...operators,
              Q2: item,
            })
          }
        />
      </View>

      <View style={tailwind("mb-4")}>
        <View style={tailwind("mb-2")}>
          <CustomText variant="medium" style={tailwind("text-xl")}>
            Q3 (Polarization)
          </CustomText>
        </View>
        <GateList
          items={gates}
          selectedGate={operators.Q3}
          onValueChange={(item, _) =>
            setOperators({
              ...operators,
              Q3: item,
            })
          }
        />
      </View>

      <View style={tailwind("flex-row flex self-end my-8")}>
        {edit ? (
          <TouchableOpacity
            style={tailwind("py-2 px-4 rounded-xl bg-red-500 mr-2")}
            onPress={() => {
              onDelete(operators.id);
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
            onSave(operators);
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
