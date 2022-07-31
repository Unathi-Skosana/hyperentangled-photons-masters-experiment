export const MSGIDs = [
  "mot_get_moveabsparams",
  "hw_get_info",
  "mot_get_dcstatusupdate",
  "mot_get_poscounter",
  "mot_get_velparams",
  "mot_get_homeparams",
  "mot_get_jogparams",
  "mot_get_moverelparams",
];

export const HOME_DIRECTION = {
  1: "Forward",
  2: "Reverse",
};

export const LIMIT_SWITCH = {
  1: "Hardware reverse",
  4: "Hardware forward",
};

export const JOG_MODE = {
  1: "Continuous",
  2: "Discrete",
};

export const JOG_STOP_MODE = {
  1: "Abrupt",
  2: "Profiled",
};

export const POS_SCALE = 1919.64; // 1 / deg
export const VEL_SCALE = 42941.66; // deg / s
export const ACCEL_SCALE = 14.66; // deg / s^2
