export const jog_mode = [
  {
    value: 1,
    name: "Continuous",
    description:
      "Jogging continues for as long as the jogging trigger is being active",
  },
  {
    value: 2,
    name: "Single",
    description: "Jogging initiates a single move with a predefined step size",
  },
];

export const stop_mode = [
  {
    value: 1,
    name: "Abrupt",
    description: "Abrupt stop",
  },
  {
    value: 2,
    name: "Profiled",
    description: "Controlled decelerating stop",
  },
];

export const home_direction = [
  {
    value: 1,
    name: "Forward",
    description: "The positive direction sense for a move to Home",
  },
  {
    value: 2,
    name: "Reverse",
    description: "The positive direction sense for a move to Home",
  },
];

export const limit_switch = [
  {
    value: 1,
    name: "Hardware reverse",
    description: "The reverse limit switch associated with the home position",
  },
  {
    value: 4,
    name: "Hardware forward",
    description: "The forward limit switch associated with the home position",
  },
];

export const move_type = [
  {
    value: 0,
    name: "Absolute",
    description: "Move relative to the zero position",
  },
  {
    value: 1,
    name: "Relative",
    description: "Move relative to the current position",
  },
];

export const end_move = [
  {
    value: 0,
    name: "Remain",
    description: "Remain at the final position at the end of this move",
  },
  {
    value: 1,
    name: "Return",
    description: "Return to the current position at the end of this move",
  },
];
