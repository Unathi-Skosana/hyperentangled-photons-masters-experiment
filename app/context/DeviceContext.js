import React, {
  useState,
  useContext,
  useEffect,
  useReducer,
  createContext,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "lodash";

import server from "@/lib/server";

import { POS_SCALE, VEL_SCALE, ACCEL_SCALE } from "@/constants/thorlabs_apt";

export const DeviceContext = createContext();
const { Provider } = DeviceContext;

const initialState = {
  devices: [],
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "on_change":
      const newState = set({ ...state }, payload.key, payload.value);
      return newState;
    case "load":
      if (payload === null) return initialState;
      for (const section of Object.keys(initialState)) {
        if (!(section in payload)) {
          payload[section] = initialState[section];
        }
      }
      return {
        ...state,
        ...payload,
      };
    case "reset":
      return initialState;
    default:
      return state;
  }
};

const DeviceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      // Fetch device settings
      try {
        await server.ping();
        const devices = await AsyncStorage.getItem("@devices");
        if (devices) {
          dispatch({ type: "load", payload: { devices: JSON.parse(devices) } });
        } else {
          const resp = await server.settings();
          await AsyncStorage.setItem("@devices", JSON.stringify(resp));
          dispatch({ type: "load", payload: { devices: resp } });
        }
      } catch (e) {
        /* handle error */
        console.error(e);
      }
    })();
  }, []);

  const onChange = (k, v) => {
    dispatch({
      type: "on_change",
      payload: { key: k, value: v },
    });
  };

  const putValues = async (path, device, id, values) => {
    const newValues = {};
    for (const key of Object.keys(values)) {
      if (key.includes("velocity")) {
        newValues[key] = Number(values[key]);
        onChange(`${id}.${key}`, newValues[key] * VEL_SCALE);
      } else if (key.includes("acceleration")) {
        newValues[key] = Number(values[key]);
        onChange(`${id}.${key}`, newValues[key] * ACCEL_SCALE);
      } else if (key.includes("distance") || key.includes("step_size")) {
        newValues[key] = Number(values[key]);
        onChange(`${id}.${key}`, newValues[key] * POS_SCALE);
      } else if (key === "id") {
        newValues[key] = values[key];
        onChange(`${id}.${key}`, newValues[key]);
      } else {
        newValues[key] = Number(values[key]);
        onChange(`${id}.${key}`, newValues[key]);
      }
    }

    setLoading(true);
    try {
      await server.put(path, { ...newValues, device });
      setLoading(false);
    } catch (e) {
      /* handle error */
      setLoading(false);
      console.error(e);
    }
  };

  const homeDevice = async (device) => {
    setLoading(true);
    try {
      await server.home(device);
    } catch (e) {
      /* handle error */
      setLoading(false);
      console.error(e);
    }
  };

  const startSequence = async (
    sequence,
    cycles = 1,
    acquire = 0,
    period = 10,
    rounds = 2
  ) => {
    setLoading(true);
    try {
      const res = await server.sequencer(
        sequence,
        cycles,
        acquire,
        period,
        rounds
      );
      setLoading(false);

      return res;
    } catch (e) {
      /* handle error */
      setLoading(false);
      console.error(e);
    }
  };

  if (state.devices.length)
    return (
      <Provider
        value={{
          state,
          loading,
          dispatch,
          onChange,
          putValues,
          homeDevice,
          startSequence,
        }}
      >
        {children}
      </Provider>
    );

  return null;
};

export const useDeviceSelector = (path, fallback) => {
  const { state } = useContext(DeviceContext);
  let value = get(state, path);

  if (isUndefined(value)) {
    value = isUndefined(fallback) ? state : fallback;
  }

  return value;
};

export const useDeviceDispatch = () => {
  const { dispatch } = useContext(DeviceContext);
  return dispatch;
};
export const useDeviceContext = () => useContext(DeviceContext);
export default DeviceProvider;
