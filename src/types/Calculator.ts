export type Language = {
  key: string;
  label: string;
  active: boolean;
};

export type Operator = "+" | "-" | "*" | "/";

export type CalculatorErrorKey =
  | "divided_by_zero"
  | "invalid_number_for_square_root"
  | "invalid_number_for_cubic_root"
  | "invalid_factorial_input";

export type CalculatorDisplayValue = string | number;

export interface CalculatorState {
  languages: Language[];
  currentValue: string;
  currentTemporaryValue: string;
  currentMemoryValue: string;
  currentResult: string;
  currentOperator: Operator | "";
  goingToDoOperation: boolean;
  isInfinity: boolean;
  alreadyDoneEqualOperation: boolean;
  error: CalculatorErrorKey | "";
}
