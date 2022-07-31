import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "@/navigation/home";
import SettingsScreen from "@/scenes/settings";
import HomeParameters from "@/scenes/settings/stacks/HomeParameters";
import JogParameters from "@/scenes/settings/stacks/JogParameters";
import VelocityParameters from "@/scenes/settings/stacks/VelocityParameters";
import AddSequence from "@/scenes/sequencer/stacks/AddSequence";
import MoveParameters from "@/scenes/composer/stacks/MoveParameters";

import DeviceProvider from "@/context/DeviceContext";

const Stack = createStackNavigator();

const App = () => {
  return (
    <DeviceProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            title: "",
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Home Parameters" component={HomeParameters} />
          <Stack.Screen name="Jog Parameters" component={JogParameters} />
          <Stack.Screen
            name="Velocity Parameters"
            component={VelocityParameters}
          />
          <Stack.Screen name="Move Parameters" component={MoveParameters} />
          <Stack.Screen name="Add Sequence" component={AddSequence} />
        </Stack.Navigator>
      </NavigationContainer>
    </DeviceProvider>
  );
};

export default App;
