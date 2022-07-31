import React, { useRef, useState } from "react";
import { SafeAreaView, View, ScrollView, TouchableOpacity } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import tailwind from "tailwind-rn";

import ProgressIndicator from "@/components/ProgressIndicator";
import CustomText from "@/components/CustomText";
import AnimatedSequenceItem from "@/components/AnimatedSequenceItem";
import { Table, Row, Rows } from "@/components/Table";

import { useDeviceContext } from "@/context/DeviceContext";
import { Q1_map, Q2_map, Q3_map } from "@/constants/moves_mapping";

import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const SequencerScreen = ({ navigation }) => {
  const sheetRef = useRef(null);
  const fall = new Animated.Value(1);

  const [items, setItems] = useState([]);
  const [results, setResults] = useState({
    coincidences: [],
    duration: 0,
    status: "ok",
  });
  const { loading, startSequence } = useDeviceContext();

  const onDelete = (id) => {
    setItems((s) => s.filter((item, _) => item.id !== id));
  };

  const onSave = (item) => {
    const filteredItems = items.filter((i, _) => i.id !== item.id);
    setItems([...filteredItems, item]);
  };

 const onStart = async (cycles, acquire, period, rounds, dwell) => {
	const seq = items.map((item, _) => {
		const s = [
			Q2_map[item["Q2"]],
			Q1_map[item["Q1"]],
			Q3_map[item["Q3"]],
		].flat();

		return s;
    });


	console.log(cycles, acquire, period, rounds, dwell)
	const res = await startSequence(seq, cycles, acquire, period, rounds, dwell);
	setResults(res);
	sheetRef.current.snapTo(0);
 }

  const disabled = items.length == 0

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
          <CustomText style={tailwind("text-2xl")}>
            Projector sequencer
          </CustomText>
        </View>

        <TouchableOpacity
          style={tailwind("py-2 px-4 rounded-xl bg-purple-500 self-end mb-8")}
	      disabled={disabled}
          onPress={() => {
				navigation.navigate("Move Parameters", {
                  onStart,
                });
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
            <AnimatedSequenceItem
              key={index}
              index={index}
              data={item}
              onClick={() => {
                navigation.navigate("Add Sequence", {
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
            navigation.navigate("Add Sequence", {
              edit: false,
              item: {},
              onSave,
            });
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
