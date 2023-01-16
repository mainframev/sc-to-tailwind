import { defineTest } from "jscodeshift/dist/testUtils";

defineTest(__dirname, "index", null, "sc-basic", { parser: "tsx" });
