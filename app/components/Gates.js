import React from "react";

import Zero from "@/assets/gates/zero.svg";
import One from "@/assets/gates/one.svg";
import Plus from "@/assets/gates/plus.svg";
import Minus from "@/assets/gates/minus.svg";
import PlusI from "@/assets/gates/plus_i.svg";
import MinusI from "@/assets/gates/minus_i.svg";

const gates = {
  0: (props) => <Zero width={50} height={50} {...props} />,
  1: (props) => <One width={50} height={50} {...props} />,
  "+": (props) => <Plus width={50} height={50} {...props} />,
  "-": (props) => <Minus width={50} height={50} {...props} />,
  i: (props) => <PlusI width={50} height={50} {...props} />,
  "-i": (props) => <MinusI width={50} height={50} {...props} />,
};

export default gates;
