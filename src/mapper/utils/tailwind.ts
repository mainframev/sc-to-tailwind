import debug from "debug";
import { Declaration } from "postcss";
import TAILWIND_CLASSES from "../constants";
import getSpacingUtils from "./spacing";
import { getBorderUtils, getBorderColorUtils } from "./borders";
import getColorUtils from "./colors";
import getBorderRadiusUtils from "./border-radius";

function getTailwindUtils(decl: Declaration) {
  const prop = TAILWIND_CLASSES[decl.prop];
  debug("prop = ", decl.prop);
  debug("value = ", decl.value);
  // remove !important from values
  const val = decl.value.replace(" !important", "");
  let output = "";
  switch (decl.prop) {
    case "margin":
    case "margin-left":
    case "margin-right":
    case "margin-top":
    case "margin-bottom":
    case "padding":
    case "padding-left":
    case "padding-right":
    case "padding-top":
    case "padding-bottom":
      output = getSpacingUtils(decl);
      break;

    case "border":
    case "border-top":
    case "border-bottom":
    case "border-left":
    case "border-right":
      output = getBorderUtils(decl);
      break;

    case "color":
    case "background-color":
    case "background":
      if (decl.value !== "inherit" && !decl.value.includes("var")) {
        output = getColorUtils(decl);
      }
      break;

    case "border-radius":
      output = getBorderRadiusUtils(decl);
      break;

    case "border-color":
      output = getBorderColorUtils(decl);
      break;

    case "opacity":
      if (decl.value.startsWith(".")) {
        decl.value = `0${decl.value}`;
      }
      output = prop[decl.value] || "";
      break;

    default:
      if (prop) {
        output = prop[val] || "";
      } else {
        debug("Unknown prop: ", decl.prop);
      }
  }

  return output;
}

export default getTailwindUtils;
