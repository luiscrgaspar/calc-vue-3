import {
  countDecimals,
  countNumberBeforePoint,
  formatReciprocalResult,
  formatResult,
  formatRootResult,
  getMinDecimalPlaces,
} from "@/services/resultFormatter";

describe("resultFormatter", () => {
  test("counts decimal places and calculates the maximum display precision", () => {
    expect(countNumberBeforePoint(1)).toBe(0);
    expect(countNumberBeforePoint(12.345)).toBe(2);
    expect(countDecimals(1)).toBe(0);
    expect(countDecimals(1.234)).toBe(3);
    expect(getMinDecimalPlaces(0.7142857142857143)).toBe(11);
    expect(getMinDecimalPlaces(1234567890123.45)).toBe(0);
  });

  test("formats regular, long and division results", () => {
    expect(formatResult(8, "+")).toEqual({ value: "8", isInfinity: false });
    expect(formatResult(58149737003040060000000000, "*")).toEqual({
      value: "5.814974e+25",
      isInfinity: false,
    });
    expect(formatResult(0.7142857142857143, "/")).toEqual({
      value: "0.71428571429",
      isInfinity: false,
    });
  });

  test("marks infinity so the component can translate it", () => {
    expect(formatResult(Infinity, "*")).toEqual({
      value: "infinity",
      isInfinity: true,
    });
    expect(formatResult(-Infinity, "*")).toEqual({
      value: "-infinity",
      isInfinity: true,
    });
  });

  test("formats root and reciprocal results", () => {
    expect(formatRootResult(3)).toBe("3");
    expect(formatReciprocalResult(1 / 3)).toBe("3.3333333e-1");
  });
});
