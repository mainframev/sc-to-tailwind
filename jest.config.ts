import type { JestConfigWithTsJest } from "ts-jest";
import { defaults as tsjPreset } from "ts-jest/presets";

const cfg: JestConfigWithTsJest = {
  transform: { ...tsjPreset.transform },
  testPathIgnorePatterns: ["build", "node_modules"],
  testEnvironment: "node",
};

export default cfg;
