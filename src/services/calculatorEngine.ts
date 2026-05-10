import {
  ADDITION_OPERATOR,
  DIVISION_OPERATOR,
  MULTIPLICATION_OPERATOR,
  SUBTRACTION_OPERATOR,
} from "@/constants/calculatorOperators";
import { CalculatorErrorKey, Operator } from "@/types/Calculator";
import { countDecimals, getMinDecimalPlaces } from "@/services/resultFormatter";

export type BinaryOperationResult = number | CalculatorErrorKey;
export type FactorialResult = number | CalculatorErrorKey;

export function calculatePercentage(value: number, hasOperator: boolean): string {
  return hasOperator ? (value / 100).toString() : "0";
}

export function calculateSquare(value: number): number {
  return value * value;
}

export function calculateCube(value: number): number {
  return value * value * value;
}

export function calculateSquareRoot(value: number): number {
  return Math.sqrt(value);
}

export function calculateCubicRoot(value: number): number {
  return Math.cbrt(value);
}

export function calculateFactorial(value: number): FactorialResult {
  if (value < 0 || !Number.isInteger(value)) return "invalid_factorial_input";

  let currentValue = value;
  let result = 1;

  while (currentValue > 0) {
    result *= currentValue;
    currentValue--;
  }

  return result;
}

export function calculateReciprocal(value: number): number {
  return 1 / value;
}

export function calculateBinaryOperation(
  operator: Operator | "",
  currentTemporaryValue: number,
  currentValue: number,
  alreadyDoneEqualOperation: boolean
): BinaryOperationResult {
  const decimalsCurrentNumber = countDecimals(currentValue);
  const decimalsCurrentTemporaryNumber = countDecimals(currentTemporaryValue);

  switch (operator) {
    case ADDITION_OPERATOR:
      return currentTemporaryValue + currentValue;
    case SUBTRACTION_OPERATOR:
      return !alreadyDoneEqualOperation
        ? currentTemporaryValue - currentValue
        : currentValue - currentTemporaryValue;
    case MULTIPLICATION_OPERATOR:
      return +(currentTemporaryValue * currentValue).toFixed(
        Math.max(decimalsCurrentNumber, decimalsCurrentTemporaryNumber)
      );
    case DIVISION_OPERATOR: {
      const divisor = alreadyDoneEqualOperation
        ? currentTemporaryValue
        : currentValue;
      if (divisor === 0) return "divided_by_zero";

      const result = !alreadyDoneEqualOperation
        ? currentTemporaryValue / currentValue
        : currentValue / currentTemporaryValue;

      return +result.toFixed(getMinDecimalPlaces(result));
    }
    default:
      return 0;
  }
}
