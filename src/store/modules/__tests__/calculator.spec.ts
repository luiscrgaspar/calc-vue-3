import calculator from "@/store/modules/calculator";
import { CalculatorDisplayValue, CalculatorState } from "@/types/Calculator";

type CalculatorPayload = CalculatorDisplayValue | boolean;
type CalculatorCommit = (mutation: string, payload: CalculatorPayload) => void;

interface CalculatorModule {
  state: CalculatorState;
  getters: Record<string, (state: CalculatorState) => unknown>;
  mutations: Record<string, (state: CalculatorState, payload: CalculatorPayload) => void>;
  actions: Record<string, (context: { commit: CalculatorCommit }, payload: CalculatorPayload) => void>;
}

const calculatorModule = calculator as CalculatorModule;

function createState(overrides: Partial<CalculatorState> = {}): CalculatorState {
  return {
    ...JSON.parse(JSON.stringify(calculatorModule.state)),
    ...overrides,
  };
}

describe("calculator store module", () => {
  test("getters expose calculator state", () => {
    const state = createState({
      currentValue: "12",
      currentTemporaryValue: "7",
      currentMemoryValue: "5",
      currentOperator: "+",
      goingToDoOperation: true,
      currentResult: "19",
      isInfinity: true,
      alreadyDoneEqualOperation: true,
      error: "divided_by_zero",
    });

    expect(calculatorModule.getters.languages(state)).toEqual(state.languages);
    expect(calculatorModule.getters.currentValue(state)).toBe("12");
    expect(calculatorModule.getters.currentTemporaryValue(state)).toBe("7");
    expect(calculatorModule.getters.currentMemoryValue(state)).toBe("5");
    expect(calculatorModule.getters.currentOperator(state)).toBe("+");
    expect(calculatorModule.getters.goingToDoOperation(state)).toBe(true);
    expect(calculatorModule.getters.currentResult(state)).toBe("19");
    expect(calculatorModule.getters.isInfinity(state)).toBe(true);
    expect(calculatorModule.getters.alreadyDoneEqualOperation(state)).toBe(true);
    expect(calculatorModule.getters.error(state)).toBe("divided_by_zero");
  });

  test("setCurrentLanguage activates only the requested language", () => {
    const state = createState();

    calculatorModule.mutations.setCurrentLanguage(state, "pt-PT");

    expect(state.languages).toEqual([
      { key: "en-US", label: "EN", active: false },
      { key: "es-ES", label: "ES", active: false },
      { key: "pt-PT", label: "PT", active: true },
    ]);
  });

  test("addToCurrentValue starts a decimal value after selecting an operator", () => {
    const state = createState({
      currentValue: "8",
      goingToDoOperation: true,
    });

    calculatorModule.mutations.addToCurrentValue(state, ".");

    expect(state.currentValue).toBe("0.");
    expect(state.goingToDoOperation).toBe(false);
  });

  test("addToCurrentValue replaces the display after selecting an operator", () => {
    const state = createState({
      currentValue: "8",
      goingToDoOperation: true,
    });

    calculatorModule.mutations.addToCurrentValue(state, "3");

    expect(state.currentValue).toBe("3");
    expect(state.goingToDoOperation).toBe(false);
  });

  test("mutations update scalar calculator state", () => {
    const state = createState();

    calculatorModule.mutations.setCurrentValue(state, 42);
    calculatorModule.mutations.setCurrentTemporaryValue(state, 21);
    calculatorModule.mutations.setCurrentMemoryValue(state, "5");
    calculatorModule.mutations.setCurrentOperator(state, "/");
    calculatorModule.mutations.setGoingToDoOperation(state, true);
    calculatorModule.mutations.setCurrentResult(state, "2");
    calculatorModule.mutations.setIsInfinity(state, true);
    calculatorModule.mutations.setAlreadyDoneEqualOperation(state, true);
    calculatorModule.mutations.setError(state, "divided_by_zero");

    expect(state.currentValue).toBe("42");
    expect(state.currentTemporaryValue).toBe("21");
    expect(state.currentMemoryValue).toBe("5");
    expect(state.currentOperator).toBe("/");
    expect(state.goingToDoOperation).toBe(true);
    expect(state.currentResult).toBe("2");
    expect(state.isInfinity).toBe(true);
    expect(state.alreadyDoneEqualOperation).toBe(true);
    expect(state.error).toBe("divided_by_zero");
  });

  test("actions commit their matching mutations", () => {
    const commit = jest.fn();
    const context = { commit };

    calculatorModule.actions.setCurrentLanguage(context, "es-ES");
    calculatorModule.actions.addToCurrentValue(context, "9");
    calculatorModule.actions.setCurrentValue(context, "8");
    calculatorModule.actions.setCurrentTemporaryValue(context, "7");
    calculatorModule.actions.setCurrentMemoryValue(context, "6");
    calculatorModule.actions.setCurrentOperator(context, "+");
    calculatorModule.actions.setGoingToDoOperation(context, true);
    calculatorModule.actions.setCurrentResult(context, "15");
    calculatorModule.actions.setIsInfinity(context, true);
    calculatorModule.actions.setAlreadyDoneEqualOperation(context, true);
    calculatorModule.actions.setError(context, "divided_by_zero");

    expect(commit.mock.calls).toEqual([
      ["setCurrentLanguage", "es-ES"],
      ["addToCurrentValue", "9"],
      ["setCurrentValue", "8"],
      ["setCurrentTemporaryValue", "7"],
      ["setCurrentMemoryValue", "6"],
      ["setCurrentOperator", "+"],
      ["setGoingToDoOperation", true],
      ["setCurrentResult", "15"],
      ["setIsInfinity", true],
      ["setAlreadyDoneEqualOperation", true],
      ["setError", "divided_by_zero"],
    ]);
  });
});
