import React, { useRef, useState } from "react";
import { SafeAreaView, View, ScrollView, TouchableOpacity } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import tailwind from "tailwind-rn";

import ProgressIndicator from "@/components/ProgressIndicator";
import CustomText from "@/components/CustomText";
import AnimatedMoveItem from "@/components/AnimatedMoveItem";
import { Table, Row, Rows } from "@/components/Table";

import { useDeviceContext } from "@/context/DeviceContext";

import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

import { VEL_SCALE, ACCEL_SCALE } from "@/constants/thorlabs_apt";

const SequencerScreen = ({ navigation }) => {
  const sheetRef = useRef(null);
  const fall = new Animated.Value(1);

  const [items, setItems] = useState([]);
  const [results, setResults] = useState({
    coincidences: [],
    duration: 0,
    status: "ok",
  });
  const { state, loading, startSequence } = useDeviceContext();
  const devices = state.devices;

  const names = devices.map((item, _) => {
    if (item) return "empty";
    return `${item.hw_get_info.name} - ${item.hw_get_info.serial_number}`;
  });

  const onDelete = (id) => {
    setItems((s) => s.filter((item, _) => item.id !== id));
  };

  const onSave = (item) => {
    const filteredItems = items.filter((i, _) => i.id !== item.id);
    setItems([...filteredItems, item]);
  };

  const renderInner = () => {
    const coincidences = results ? results.coincidences : [];

    return (
      <View style={tailwind("w-full h-full p-5 bg-white")}>
        <View style={tailwind("items-start mb-6")}>
          <CustomText style={tailwind("text-2xl")}>Results</CustomText>
        </View>
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
            data={coincidences.map((i, j) => {
              return [j, i];
            })}
          />
        </Table>
      </View>
    );
  };

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        snapPoints={["70%", 0]}
        renderContent={renderInner}
        initialSnap={1}
        callbackNode={fall}
        enabledInnerScrolling={true}
      />

      {loading && <ProgressIndicator />}
      <SafeAreaView style={tailwind("h-full bg-white p-6")}>
        <View style={tailwind("items-start mb-6")}>
          <CustomText style={tailwind("text-2xl")}>Move sequencer</CustomText>
        </View>

        <TouchableOpacity
          style={tailwind("py-2 px-4 rounded-xl bg-purple-500 self-end mb-8")}
          onPress={async () => {
            const newItems = items.map((item, i) => {
              return {
                ...item,
                min_velocity: Number(
                  Number(
                    devices[i].mot_get_velparams.min_velocity / VEL_SCALE
                  ).toFixed(2)
                ),
                max_velocity: Number(
                  Number(
                    devices[i].mot_get_velparams.max_velocity / VEL_SCALE
                  ).toFixed(2)
                ),
                acceleration: Number(
                  Number(
                    devices[i].mot_get_velparams.acceleration / ACCEL_SCALE
                  ).toFixed(2)
                ),
                distance: Number(Number(item.distance).toFixed(2)),
                dwell: Number(Number(item.dwell).toFixed(2)),
              };
            });

            const res = await startSequence(newItems, 1, 1, 10, 2);
            setResults(res);
            //sheetRef.current.snapTo(0);
          }}
        >
          <CustomText
            variant="medium"
            style={tailwind("text-white text-2xl text-center")}
          >
            START
          </CustomText>
        </TouchableOpacity>

        <ScrollView>
          {items.map((item, index) => (
            <AnimatedMoveItem
              key={index}
              index={index}
              data={{ ...item, device: names[item.device] }}
              onClick={() => {
                navigation.navigate("Add Move", {
                  edit: true,
                  item,
                  onSave,
                  onDelete,
                });
              }}
            />
          ))}
        </ScrollView>
        <TouchableOpacity
          style={tailwind(
            "w-12 h-12 bg-indigo-500 bottom-10 right-10 rounded-full items-center justify-center absolute"
          )}
          onPress={() => {
            navigation.navigate("Add Move", { edit: false, item: {}, onSave });
          }}
        >
          <CustomText variant="bold" style={tailwind("text-white text-4xl")}>
            &#43;
          </CustomText>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default SequencerScreen;
