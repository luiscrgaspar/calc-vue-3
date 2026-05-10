import {
  CalculatorDisplayValue,
  CalculatorErrorKey,
  CalculatorState,
  Language,
  Operator,
} from "../../types/Calculator";

interface IContext {
  commit: (
    action: string,
    payload: string | boolean | CalculatorDisplayValue
  ) => void;
}

export const getDefaultState = (): CalculatorState => ({
  languages: [
    {
      key: "en-US",
      label: "EN",
      active: true,
    },
    {
      key: "es-ES",
      label: "ES",
      active: false,
    },
    {
      key: "pt-PT",
      label: "PT",
      active: false,
    },
  ],
  currentValue: "0",
  currentTemporaryValue: "",
  currentMemoryValue: "",
  currentResult: "",
  currentOperator: "",
  goingToDoOperation: false,
  isInfinity: false,
  alreadyDoneEqualOperation: false,
  error: "",
});

const getters = {
  languages: (state: CalculatorState): Language[] => state.languages,
  currentValue: (state: CalculatorState): string => state.currentValue,
  currentTemporaryValue: (state: CalculatorState): string => state.currentTemporaryValue,
  currentMemoryValue: (state: CalculatorState): string => state.currentMemoryValue,
  currentOperator: (state: CalculatorState): Operator | "" => state.currentOperator,
  goingToDoOperation: (state: CalculatorState): boolean => state.goingToDoOperation,
  currentResult: (state: CalculatorState): string => state.currentResult,
  isInfinity: (state: CalculatorState): boolean => state.isInfinity,
  alreadyDoneEqualOperation: (state: CalculatorState): boolean => state.alreadyDoneEqualOperation,
  error: (state: CalculatorState): CalculatorErrorKey | "" => state.error,
};

const mutations = {
  setCurrentLanguage(state: CalculatorState, payload: string): void {
    const newLanguages: Language[] = [];
    state.languages.forEach((lang) => {
      newLanguages.push({ ...lang, active: lang.key === payload });
    });
    state.languages = [...newLanguages];
  },
  addToCurrentValue(state: CalculatorState, payload: string): void {
    if (payload === "." && state.goingToDoOperation) {
      state.goingToDoOperation = false;
      state.currentValue = "0.";
      return;
    }

    if (payload === "." && state.currentValue.includes(".")) {
      return;
    }

    state.currentValue =
      (state.currentValue === "0" && payload !== ".") ||
      state.goingToDoOperation
        ? payload
        : state.currentValue.toString() + payload;

    if (state.goingToDoOperation) state.goingToDoOperation = false;
  },
  setCurrentValue(state: CalculatorState, payload: CalculatorDisplayValue): void {
    state.currentValue = payload.toString();
  },
  setCurrentTemporaryValue(state: CalculatorState, payload: CalculatorDisplayValue): void {
    state.currentTemporaryValue = payload.toString();
  },
  setCurrentMemoryValue(state: CalculatorState, payload: string): void {
    state.currentMemoryValue = payload;
  },
  setCurrentOperator(state: CalculatorState, payload: Operator | ""): void {
    state.currentOperator = payload;
  },
  setGoingToDoOperation(state: CalculatorState, payload: boolean): void {
    state.goingToDoOperation = payload;
  },
  setCurrentResult(state: CalculatorState, payload: string): void {
    state.currentResult = payload;
  },
  setIsInfinity(state: CalculatorState, payload: boolean): void {
    state.isInfinity = payload;
  },
  setAlreadyDoneEqualOperation(state: CalculatorState, payload: boolean): void {
    state.alreadyDoneEqualOperation = payload;
  },
  setError(state: CalculatorState, payload: CalculatorErrorKey | ""): void {
    state.error = payload;
  },
};

const actions = {
  setCurrentLanguage(context: IContext, payload: string): void {
    context.commit("setCurrentLanguage", payload);
  },
  addToCurrentValue(context: IContext, payload: string): void {
    context.commit("addToCurrentValue", payload);
  },
  setCurrentValue(context: IContext, payload: CalculatorDisplayValue): void {
    context.commit("setCurrentValue", payload);
  },
  setCurrentTemporaryValue(context: IContext, payload: CalculatorDisplayValue): void {
    context.commit("setCurrentTemporaryValue", payload);
  },
  setCurrentMemoryValue(context: IContext, payload: string): void {
    context.commit("setCurrentMemoryValue", payload);
  },
  setCurrentOperator(context: IContext, payload: Operator | ""): void {
    context.commit("setCurrentOperator", payload);
  },
  setGoingToDoOperation(context: IContext, payload: boolean): void {
    context.commit("setGoingToDoOperation", payload);
  },
  setCurrentResult(context: IContext, payload: string): void {
    context.commit("setCurrentResult", payload);
  },
  setIsInfinity(context: IContext, payload: boolean): void {
    context.commit("setIsInfinity", payload);
  },
  setAlreadyDoneEqualOperation(context: IContext, payload: boolean): void {
    context.commit("setAlreadyDoneEqualOperation", payload);
  },
  setError(context: IContext, payload: CalculatorErrorKey | ""): void {
    context.commit("setError", payload);
  },
};

export default {
  state: getDefaultState,
  getters,
  mutations,
  actions,
};
