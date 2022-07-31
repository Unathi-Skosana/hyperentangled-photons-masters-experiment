import React, { useMemo } from "react";
import { useSafeArea } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AnimatedTabBar from "@gorhom/animated-tabbar";

import Dashboard from "@/scenes/dashboard";
import Composer from "@/scenes/composer";
import Sequencer from "@/scenes/sequencer";
import Playground from "@/scenes/playground";

import AnimatedHomeSVG from "@/components/svg/HomeSVG";
import AnimatedBeakerSVG from "@/components/svg/BeakerSVG";
import AnimatedTableSVG from "@/components/svg/TableSVG";
import AnimatedVariableSVG from "@/components/svg/VariableSVG";

const tabs = {
  Dashboard: {
    // < Screen name
    labelStyle: {
      color: "#5B37B7",
    },
    icon: {
      component: AnimatedHomeSVG,
      color: "rgba(91,55,183,1)",
    },
  },
  Composer: {
    // < Screen name
    labelStyle: {
      color: "#C9379D",
    },
    icon: {
      component: AnimatedBeakerSVG,
      color: "rgba(201,55,157,0.5)",
    },
  },
  SeqComposer: {
    // < Screen name
    labelStyle: {
      color: "#E6A919",
    },
    icon: {
      component: AnimatedTableSVG,
      color: "rgba(230,169,25,0.5)",
    },
  },
  Playground: {
    // < Screen name
    labelStyle: {
      color: "#1194AA",
    },
    icon: {
      component: AnimatedVariableSVG,
      color: "rgba(17,148,170,1)",
    },
  },
};

const Tab = createBottomTabNavigator();

const Home = () => {
  // hooks
  const { bottom } = useSafeArea();

  // memos
  const screenPaddingBottom = useMemo(() => {
    // icon size + margin padding + outer space + inner space + screen bottom padding
    return 20 + bottom + 12 * 2 + 12 * 2 + 12;
  }, [bottom]);

  const tabBarOptions = useMemo(
    () => ({
      safeAreaInsets: {
        bottom: 0,
      },
      style: {
        marginBottom: bottom,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        elevation: 24,
      },
    }),
    [bottom]
  );

  return (
    <Tab.Navigator
      tabBarOptions={tabBarOptions}
      tabBar={(props) => (
        <AnimatedTabBar
          preset="flashy"
          tabs={tabs}
          iconSize={20}
          itemInnerSpace={12}
          itemOuterSpace={12}
          {...props}
        />
      )}
    >
      <Tab.Screen
        name="Dashboard"
        initialParams={{
          nextScreen: "Composer",
          paddingBottom: screenPaddingBottom,
        }}
        component={Dashboard}
      />
      <Tab.Screen
        name="Composer"
        initialParams={{
          nextScreen: "Sequencer",
          paddingBottom: screenPaddingBottom,
        }}
        component={Composer}
      />
      <Tab.Screen
        name="SeqComposer"
        initialParams={{
          nextScreen: "Playground",
          paddingBottom: screenPaddingBottom,
        }}
        component={Sequencer}
      />
      <Tab.Screen
        name="Playground"
        initialParams={{
          nextScreen: "Dashboard",
          paddingBottom: screenPaddingBottom,
        }}
        component={Playground}
      />
    </Tab.Navigator>
  );
};

export default Home;
