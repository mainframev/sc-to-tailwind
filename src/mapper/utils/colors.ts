import chroma from "chroma-js";
import colors from "tailwindcss/colors";
import { Declaration } from "postcss";
import TAILWIND_CLASSES from "../constants";

function deltaRgb(rgb1: number[], rgb2: number[]) {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  const drp2 = (r1 - r2) ** 2;
  const dgp2 = (g1 - g2) ** 2;
  const dbp2 = (b1 - b2) ** 2;
  const t = (r1 + r2) / 2;

  return Math.sqrt(2 * drp2 + 4 * dgp2 + 3 * dbp2 + (t * (drp2 - dbp2)) / 256);
}

const defaultColors = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "lime",
  "green",
  "emerald",
  "yellow",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

function getProximateColor(decl: Declaration) {
  const twColors = Object.keys(colors)
    .filter(c => defaultColors.includes(c))
    .map(c => {
      const shades = colors[c];
      const palette = Object.keys(shades).map(s => {
        return {
          "background-color": `bg-${c}-${s}`,
          background: `bg-${c}-${s}`,
          color: `text-${c}-${s}`,
          border: `border-${c}-${s}`,
          "border-top": `border-t-${c}-${s}`,
          "border-right": `border-r-${c}-${s}`,
          "border-bottom": `border-b-${c}-${s}`,
          "border-left": `border-l-${c}-${s}`,
          "border-color": `border-${c}-${s}`,
          hex: shades[s],
        };
      });
      return palette;
    })
    .flat();

  const sorted = twColors
    .map(c => {
      let _val = decl.value;
      if (decl.prop === "border" || decl.prop.match(/border-(top|right|bottom|left)/)) {
        const borderValues = decl.value.split(" ");
        if (borderValues.length > 2) {
          const [, , ...colorValues] = borderValues;
          _val = colorValues.join("");
        }
      }
      _val = _val.replace(" !important", "");

      const diff = deltaRgb(chroma(_val).rgb(), chroma(c.hex).rgb());
      return { ...c, diff };
    })
    .sort((a, b) => a.diff - b.diff);

  return sorted[0][decl.prop];
}

function getColorUtils(decl: Declaration) {
  if (decl.value.includes("url")) return " ";
  const hash = TAILWIND_CLASSES[decl.prop];

  return hash ? hash[decl.value] || getProximateColor(decl) : getProximateColor(decl);
}

export default getColorUtils;
