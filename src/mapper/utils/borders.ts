import chroma from "chroma-js";
import { Declaration } from "postcss";
import TAILWIND_CLASSES from "../constants";
import getColorUtils from "./colors";

// Get the nearest matching Tailwind value

function getProximateKey(valueHash: Record<string, string>, value: string) {
  const values = Object.keys(valueHash);

  let distance = Math.abs(+values[0] - +value);
  let idx = 0;

  values.forEach((v, i) => {
    const currentDistance = Math.abs(+v - +value);
    if (currentDistance < distance) {
      idx = i;
      distance = currentDistance;
    }
  });

  return values[idx];
}

export function getBorderUtils(decl: Declaration) {
  if (decl.value === "none" || decl.value === "transparent") return "";
  if (decl.value === "0") return "border-0";

  const borderValues = decl.value.split(" ");

  if (borderValues.length > 2) {
    const [width, style, ...colorValue] = borderValues;
    const color = colorValue.join("");

    const borderWidth = TAILWIND_CLASSES[`${decl.prop}-width`];
    const borderStyle = TAILWIND_CLASSES["border-style"];
    const borderColor = TAILWIND_CLASSES["border-color"];
    const borderOpacity = TAILWIND_CLASSES["border-opacity"];

    const getWidth = getProximateKey(borderWidth, width);

    const w = borderWidth[width] || borderWidth[getWidth] || "border";
    const s = borderStyle[style] || "solid";
    const c = borderColor[color] || getColorUtils(decl);
    const result = `${w} ${s} ${c}`;

    if (color.includes("rgba")) {
      const [, , , opacity] = chroma(color)._rgb;
      const proximateKey = getProximateKey(borderOpacity, opacity);
      const transparency = borderOpacity[opacity] || borderOpacity[proximateKey];
      result.concat(` ${transparency}`);
    }
    return result;
  }

  return "";
}

export function getBorderColorUtils(decl: Declaration) {
  const borderColor = TAILWIND_CLASSES["border-color"];
  const borderOpacity = TAILWIND_CLASSES["border-opacity"];
  const color = decl.value;
  const result = borderColor[color] || getColorUtils(decl);

  if (color.includes("rgba")) {
    const [, , , opacity] = chroma(color)._rgb;
    const proximateKey = getProximateKey(borderOpacity, opacity);
    const transparency = borderOpacity[opacity] || borderOpacity[proximateKey];
    result.concat(` ${transparency}`);
  }

  return result;
}
