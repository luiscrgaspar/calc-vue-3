import { createStore } from "vuex";

import calculator from "./modules/calculator";
import type { CalculatorState } from "@/types/Calculator";

export type RootState = {
  calculator: CalculatorState;
};

export default createStore<RootState>({
  modules: { calculator },
});
