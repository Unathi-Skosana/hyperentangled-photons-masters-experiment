import React, { useRef, useState } from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";

import tailwind from "tailwind-rn";

import { useDeviceContext } from "@/context/DeviceContext";

import ProgressIndicator from "@/components/ProgressIndicator";
import CustomText from "@/components/CustomText";
import GateList from "@/components/GateList";
import { Table, Row, Rows } from "@/components/Table";

import { gates } from "@/constants/composer";
import { Q1_map, Q2_map, Q3_map } from "@/constants/moves_mapping";

const Composer = ({ navigation }) => {
  const sheetRef = useRef(null);
  const fall = new Animated.Value(1);

  const [operators, setOperators] = useState({
    Q1: "0",
    Q2: "0",
    Q3: "0",
  });

  const [results, setResults] = useState({
    coincidences: [],
    duration: 0,
    status: "ok",
  });

  const { loading, startSequence } = useDeviceContext();

  const onStart = async (cycles, acquire, period, rounds, dwell) => {
	const seq = [
	[
		Q2_map[operators["Q2"]],
		Q1_map[operators["Q1"]],
		Q3_map[operators["Q3"]],
	].flat()
	];

	console.log(cycles, acquire, period, rounds, dwell)
	const res = await startSequence(seq, cycles, acquire, period, rounds, dwell);
	console.log(res)
	setResults(res);
	sheetRef.current.snapTo(0);
  }


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
      <SafeAreaView style={tailwind("h-full p-5 bg-white")}>
        <Animated.View
          style={[
            {
              opacity: Animated.add(0.1, Animated.multiply(fall, 0.9)),
            },
          ]}
        >
          <View style={tailwind("items-start mb-6")}>
            <CustomText style={tailwind("text-2xl")}>Composer</CustomText>
          </View>

          <TouchableOpacity
            style={tailwind("py-2 px-4 rounded-xl bg-purple-500 self-end mb-8")}
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
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default Composer;
