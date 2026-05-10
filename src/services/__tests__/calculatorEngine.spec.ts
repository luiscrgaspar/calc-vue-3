import {
  calculateBinaryOperation,
  calculateCube,
  calculateCubicRoot,
  calculateFactorial,
  calculatePercentage,
  calculateReciprocal,
  calculateSquare,
  calculateSquareRoot,
} from "@/services/calculatorEngine";

describe("calculatorEngine", () => {
  test("calculates unary operations", () => {
    expect(calculateSquare(7)).toBe(49);
    expect(calculateCube(7)).toBe(343);
    expect(calculateSquareRoot(9)).toBe(3);
    expect(calculateCubicRoot(27)).toBe(3);
    expect(calculateFactorial(0)).toBe(1);
    expect(calculateFactorial(5)).toBe(120);
    expect(calculateReciprocal(4)).toBe(0.25);
  });

  test("returns an error key for invalid factorial input", () => {
    expect(calculateFactorial(-1)).toBe("invalid_factorial_input");
    expect(calculateFactorial(3.5)).toBe("invalid_factorial_input");
  });

  test("calculates percentage only when an operator is active", () => {
    expect(calculatePercentage(5, true)).toBe("0.05");
    expect(calculatePercentage(5, false)).toBe("0");
  });

  test("calculates binary operations", () => {
    expect(calculateBinaryOperation("+", 3, 5, false)).toBe(8);
    expect(calculateBinaryOperation("-", 3, 5, false)).toBe(-2);
    expect(calculateBinaryOperation("*", 3, 5, false)).toBe(15);
    expect(calculateBinaryOperation("/", 3, 5, false)).toBe(0.6);
  });

  test("keeps repeated equals behaviour for non-commutative operations", () => {
    expect(calculateBinaryOperation("-", 7, -2, true)).toBe(-9);
    expect(calculateBinaryOperation("/", 7, 0.71428571429, true)).toBe(0.10204081633);
  });

  test("returns an error key when dividing by zero", () => {
    expect(calculateBinaryOperation("/", 3, 0, false)).toBe("divided_by_zero");
    expect(calculateBinaryOperation("/", 0, 5, true)).toBe("divided_by_zero");
  });

  test("returns zero for an unknown binary operator", () => {
    expect(calculateBinaryOperation("", 3, 5, false)).toBe(0);
  });
});
