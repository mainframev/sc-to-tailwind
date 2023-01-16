import { Declaration } from "postcss";
import TAILWIND_CLASSES from "../constants";
import getProximateKey from "../getProximateKey";

function getBorderRadiusUtils(decl: Declaration): string {
  const hash = TAILWIND_CLASSES["border-radius"];
  const proximateKey = getProximateKey(hash, decl.value);
  return hash[decl.value] || hash[proximateKey];
}

export default getBorderRadiusUtils;
