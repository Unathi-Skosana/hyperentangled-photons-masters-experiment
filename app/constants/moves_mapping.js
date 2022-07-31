export const Q1_map = {
  0: [
    { device: 0, distance: 0 },
    { device: 1, distance: 0 },
  ],
  1: [
    { device: 0, distance: 45 },
    { device: 1, distance: 0 },
  ],
  "+": [
    { device: 0, distance: 22.5 },
    { device: 1, distance: 45 },
  ],
  "-": [
    { device: 0, distance: -22.5 },
    { device: 1, distance: 45 },
  ],
  i: [
    { device: 0, distance: 22.5 },
    { device: 1, distance: 0 },
  ],
  "-i": [
    { device: 0, distance: -22.5 },
    { device: 1, distance: 0 },
  ],
};

export const Q2_map = {
  0: [{ device: 5, proj: "0" }],
	1: [{ device: 5, proj: "1" }],
  "-": [{ device: 5, proj: "I" },{ device: 6, proj: "-", period: 1, threshold: 20 }],
  "+": [{ device: 5, proj: "I" },{ device: 6, proj: "+", period: 1, threshold: 20 }],
  i: [{ device: 5, proj: "I" },{ device: 6, proj: "i", period: 1, threshold: 20 }],
  "-i": [{ device: 5, proj: "I" },{ device: 6, proj: "-i", period: 1, threshold: 20 }],
};

export const Q3_map = {
  0: [
    { device: 2, distance: 0 },
    { device: 3, distance: 0 },
  ],
  1: [
    { device: 2, distance: 45 },
    { device: 3, distance: 0 },
  ],
  "+": [
    { device: 2, distance: 22.5 },
    { device: 3, distance: 45 },
  ],
  "-": [
    { device: 2, distance: -22.5 },
    { device: 3, distance: 45 },
  ],
  i: [
    { device: 2, distance: 22.5 },
    { device: 3, distance: 0 },
  ],
  "-i": [
    { device: 2, distance: -22.5 },
    { device: 3, distance: 0 },
  ],
};
