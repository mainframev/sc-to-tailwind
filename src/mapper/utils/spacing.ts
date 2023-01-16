import { Declaration } from "postcss";
import TAILWIND_CLASSES from "../constants";
import getProximateKey from "../getProximateKey";

const spacingProps = {
  margin: {
    top: "margin-top",
    right: "margin-right",
    bottom: "margin-bottom",
    left: "margin-left",
  },
  padding: {
    top: "padding-top",
    right: "padding-right",
    bottom: "padding-bottom",
    left: "padding-left",
  },
};

function getSpacingUtils(decl: Declaration) {
  if (decl.value.includes("var") || decl.value.includes("calc")) return "";
  const propName = decl.prop;
  const values = decl.value.split(" ");
  let output = "";

  // padding: 0;
  // padding-left / padding-right / padding-top / padding-bottom
  if (values.length === 1) {
    const hash = TAILWIND_CLASSES[decl.prop];
    const proximateKey = getProximateKey(hash, values[0]);
    output = hash[values[0]] || hash[proximateKey];
  }
  // padding: topBottom leftRight;
  if (values.length === 2) {
    const [topBottom, leftRight] = values;

    const leftProp = spacingProps[propName].left;
    const topProp = spacingProps[propName].top;

    const plHash = TAILWIND_CLASSES[leftProp];
    const ptHash = TAILWIND_CLASSES[topProp];

    const leftRightProximateKey = getProximateKey(plHash, leftRight);
    const topBottomProximateKey = getProximateKey(ptHash, topBottom);

    const px = plHash[leftRight] || plHash[leftRightProximateKey];
    const py = ptHash[topBottom] || ptHash[topBottomProximateKey];
    output = `${px.replace("l", "x")} ${py.replace("t", "y")}`;
  }

  // padding: top leftRight bottom;
  if (values.length === 3) {
    const [top, leftRight, bottom] = values;

    const leftProp = spacingProps[propName].left;
    const topProp = spacingProps[propName].top;
    const bottomProp = spacingProps[propName].bottom;

    const ptHash = TAILWIND_CLASSES[topProp];
    const plHash = TAILWIND_CLASSES[leftProp];
    const pbHash = TAILWIND_CLASSES[bottomProp];

    const topProximateKey = getProximateKey(ptHash, top);
    const leftProximateKey = getProximateKey(plHash, leftRight);
    const bottomProximateKey = getProximateKey(ptHash, bottom);

    const pt = ptHash[top] || ptHash[topProximateKey];
    const px = plHash[leftRight] || plHash[leftProximateKey];
    const pb = pbHash[bottom] || pbHash[bottomProximateKey];
    output = `${pt} ${px.replace("l", "x")} ${pb}`;
  }

  // padding: top right bottom left;
  if (values.length === 4) {
    const [top, right, bottom, left] = values;

    const leftProp = spacingProps[propName].left;
    const rightProp = spacingProps[propName].right;
    const topProp = spacingProps[propName].top;
    const bottomProp = spacingProps[propName].bottom;

    const ptHash = TAILWIND_CLASSES[topProp];
    const plHash = TAILWIND_CLASSES[leftProp];
    const prHash = TAILWIND_CLASSES[rightProp];
    const pbHash = TAILWIND_CLASSES[bottomProp];

    const topProximateKey = getProximateKey(ptHash, top);
    const leftProximateKey = getProximateKey(plHash, left);
    const rightProximateKey = getProximateKey(prHash, right);
    const bottomProximateKey = getProximateKey(ptHash, bottom);

    const pt = ptHash[top] || ptHash[topProximateKey];
    const pl = plHash[left] || plHash[leftProximateKey];
    const pr = prHash[right] || prHash[rightProximateKey];
    const pb = pbHash[bottom] || pbHash[bottomProximateKey];

    output = `${pt} ${pr} ${pb} ${pl}`;
  }

  return output;
}

export default getSpacingUtils;
