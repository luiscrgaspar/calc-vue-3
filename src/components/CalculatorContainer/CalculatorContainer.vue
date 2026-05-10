<template>
  <div>
    <LanguagesContent />
    <div class="calculator-content">
      <HeaderContent
        :error="error"
        :currentValue="currentValue.toString()"
        :currentResult="currentResult.toString()"
      />
      <CalculatorLineContent
        :icons="iconsLine1"
        @handler1="clickOnPiKey"
        @handler2="clickOnCEKey"
        @handler3="reset"
        @handler4="clickOnBackKey"
      />
      <CalculatorLineContent
        :icons="iconsLine2"
        :disabledButtons="[
          !currentMemoryValue,
          !currentMemoryValue,
          false,
          false,
        ]"
        @handler1="clickOnMCKey"
        @handler2="clickOnMRKey"
        @handler3="clickOnMSKey"
        @handler4="clickOnPercentageKey"
      />
      <CalculatorLineContent
        :icons="iconsLine3"
        @handler1="clickOnXToThePowerOf2"
        @handler2="clickOnXToThePowerOf3"
        @handler3="clickOnSquareRoot"
        @handler4="clickOnCubicRoot"
      />
      <CalculatorLineContent
        :icons="iconsLine4"
        @handler1="clickOnFactorial"
        @handler2="clickOnOneDividedByX"
        @handler3="clickOnEKey"
        @handler4="clickOnDivisionKey"
      />
      <CalculatorLineContent
        :icons="iconsLine5"
        @handler1="clickOnNumber"
        @handler2="clickOnNumber"
        @handler3="clickOnNumber"
        @handler4="clickOnMultiplicationKey"
      />
      <CalculatorLineContent
        :icons="iconsLine6"
        @handler1="clickOnNumber"
        @handler2="clickOnNumber"
        @handler3="clickOnNumber"
        @handler4="clickOnSubtractionKey"
      />
      <CalculatorLineContent
        :icons="iconsLine7"
        @handler1="clickOnNumber"
        @handler2="clickOnNumber"
        @handler3="clickOnNumber"
        @handler4="clickOnAdditionKey"
      />
      <CalculatorLineContent
        :icons="iconsLine8"
        :classButtons="equalButtonClasses"
        :disabledButtons="[false, false, false, error || isInfinity]"
        @handler1="clickOnPlusMinusKey"
        @handler2="clickOnNumberZero"
        @handler3="clickOnPointKey"
        @handler4="clickOnEqualKey"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import LanguagesContent from "@/components/LanguagesContent/LanguagesContent.vue";
import CalculatorLineContent from "@/components/CalculatorLineContent/CalculatorLineContent.vue";
import HeaderContent from "@/components/HeaderContent/HeaderContent.vue";
import {
  CALCULATOR_BUTTON_LINES,
  EQUAL_BUTTON_CLASSES,
} from "@/constants/calculatorButtons";
import {
  ADDITION_OPERATOR,
  DIVISION_OPERATOR,
  MULTIPLICATION_OPERATOR,
  SUBTRACTION_OPERATOR,
} from "@/constants/calculatorOperators";
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
import {
  formatReciprocalResult,
  formatResult,
  formatRootResult,
} from "@/services/resultFormatter";
import { CalculatorErrorKey, Operator } from "@/types/Calculator";

export default defineComponent({
  name: "CalculatorContainer",
  components: { LanguagesContent, CalculatorLineContent, HeaderContent },
  data: () => {
    return {
      iconsLine1: CALCULATOR_BUTTON_LINES.line1,
      iconsLine2: CALCULATOR_BUTTON_LINES.line2,
      iconsLine3: CALCULATOR_BUTTON_LINES.line3,
      iconsLine4: CALCULATOR_BUTTON_LINES.line4,
      iconsLine5: CALCULATOR_BUTTON_LINES.line5,
      iconsLine6: CALCULATOR_BUTTON_LINES.line6,
      iconsLine7: CALCULATOR_BUTTON_LINES.line7,
      iconsLine8: CALCULATOR_BUTTON_LINES.line8,
      equalButtonClasses: EQUAL_BUTTON_CLASSES,
    };
  },
  computed: {
    ...mapGetters([
      "currentTemporaryValue",
      "currentValue",
      "currentMemoryValue",
      "currentOperator",
      "goingToDoOperation",
      "currentResult",
      "isInfinity",
      "alreadyDoneEqualOperation",
      "error",
    ]),
  },
  methods: {
    ...mapActions([
      "addToCurrentValue",
      "setCurrentValue",
      "setCurrentTemporaryValue",
      "setCurrentMemoryValue",
      "setCurrentOperator",
      "setGoingToDoOperation",
      "setCurrentResult",
      "setIsInfinity",
      "setAlreadyDoneEqualOperation",
      "setError",
    ]),
    reset(): void {
      this.setCurrentValue("0");
      this.setCurrentTemporaryValue("");
      this.setCurrentOperator("");
      this.setCurrentResult("");
      this.setIsInfinity(false);
      this.setError("");
    },
    clickOnPiKey(): void {
      this.setCurrentValue(Math.PI.toFixed(11).toString());
      this.setError("");
      this.setIsInfinity(false);
    },
    clickOnCEKey(): void {
      this.currentResult !== "" || this.error !== "" || this.isInfinity
        ? this.reset()
        : this.setCurrentValue("0");
    },
    clickOnMCKey(): void {
      this.setCurrentMemoryValue("");
    },
    clickOnMRKey(): void {
      this.setCurrentValue(this.currentMemoryValue);
      this.setError("");
      this.setIsInfinity(false);
    },
    clickOnMSKey(): void {
      if (this.currentValue !== "0") {
        this.setCurrentMemoryValue(this.currentValue);
      }
    },
    clickOnPercentageKey(): void {
      this.setCurrentValue(
        calculatePercentage(+this.currentValue, this.currentOperator !== "")
      );
    },
    clickOnBackKey(): void {
      const trimmedValue =
        this.currentValue.length === 1
          ? "0"
          : this.currentValue.slice(0, -1);

      this.setCurrentValue(
        trimmedValue === "" || trimmedValue === "-" ? "0" : trimmedValue
      );
    },
    setFormattedCurrentValue(result: number): void {
      const formattedResult = formatResult(result, this.currentOperator);
      this.setIsInfinity(formattedResult.isInfinity);
      this.setCurrentValue(
        formattedResult.isInfinity
          ? this.$t(formattedResult.value)
          : formattedResult.value
      );
    },
    setErrorCurrentValue(error: CalculatorErrorKey): void {
      this.setError(error);
      this.setCurrentValue(this.$t(error));
    },
    clickOnXToThePowerOf2(): void {
      this.setFormattedCurrentValue(calculateSquare(+this.currentValue));
    },
    clickOnXToThePowerOf3(): void {
      this.setFormattedCurrentValue(calculateCube(+this.currentValue));
    },
    setResultOperationOrInvalidInput(
      value: number,
      error: CalculatorErrorKey
    ): void {
      this.setIsInfinity(false);
      this.setCurrentValue(
        Number.isNaN(value) ? this.$t(error) : formatRootResult(value)
      );
    },
    clickOnSquareRoot(): void {
      const valueToMakeSquareRoot = calculateSquareRoot(+this.currentValue);
      this.setError(Number.isNaN(valueToMakeSquareRoot) ? "invalid_number_for_square_root" : "");
      this.setResultOperationOrInvalidInput(
        valueToMakeSquareRoot,
        "invalid_number_for_square_root"
      );
    },
    clickOnCubicRoot(): void {
      const valueToMakeCubicRoot = calculateCubicRoot(+this.currentValue);
      this.setError(Number.isNaN(valueToMakeCubicRoot) ? "invalid_number_for_cubic_root" : "");
      this.setResultOperationOrInvalidInput(
        valueToMakeCubicRoot,
        "invalid_number_for_cubic_root"
      );
    },
    clickOnFactorial(): void {
      const result = calculateFactorial(+this.currentValue);

      if (typeof result === "string") {
        this.setErrorCurrentValue(result);
        return;
      }

      this.setFormattedCurrentValue(result);
    },
    clickOnOneDividedByX(): void {
      const result = calculateReciprocal(+this.currentValue);

      if (!Number.isFinite(result)) {
        this.setFormattedCurrentValue(result);
        return;
      }

      this.setIsInfinity(false);
      this.setCurrentValue(formatReciprocalResult(result));
    },
    clickOnEKey(): void {
      this.setCurrentValue(Math.E.toFixed(11).toString());
      this.setError("");
      this.setIsInfinity(false);
    },
    operation(operator: Operator): void {
      this.setAlreadyDoneEqualOperation(false);
      if (this.currentOperator !== "") {
        this.clickOnEqualKey();
        if (this.error || Number.isNaN(+this.currentValue)) {
          return;
        }
      }
      this.setCurrentTemporaryValue(this.currentValue);
      this.setCurrentOperator(operator);
      this.setGoingToDoOperation(true);
    },
    clickOnDivisionKey(): void {
      this.operation(DIVISION_OPERATOR);
    },
    clickOnMultiplicationKey(): void {
      this.operation(MULTIPLICATION_OPERATOR);
    },
    clickOnSubtractionKey(): void {
      this.operation(SUBTRACTION_OPERATOR);
    },
    clickOnAdditionKey(): void {
      this.operation(ADDITION_OPERATOR);
    },
    clickOnNumber(number: string | number): void {
      const numberValue = number.toString();

      if (this.alreadyDoneEqualOperation) {
        this.setCurrentValue(numberValue);
        this.setCurrentTemporaryValue("0");
        this.setAlreadyDoneEqualOperation(false);
        this.setCurrentOperator("");
      } else {
        this.addToCurrentValue(numberValue);
      }
    },
    clickOnNumberZero(): void {
      if (this.currentValue !== "0") {
        this.addToCurrentValue("0");
      }
    },
    clickOnPlusMinusKey(): void {
      this.setCurrentValue((+this.currentValue * -1).toString());
    },
    clickOnPointKey(): void {
      if (
        this.goingToDoOperation ||
        (!Number.isNaN(+this.currentValue) &&
          this.currentValue.indexOf(".") === -1)
      ) {
        this.addToCurrentValue(".");
      }
    },
    clickOnEqualKey(): void {
      if (!this.currentOperator || Number.isNaN(+this.currentValue)) return;

      const currentValueNumber = +this.currentValue;
      const currentTemporaryValueNumber =
        this.currentResult !== ""
          ? +this.currentResult
          : +this.currentTemporaryValue;
      const result = calculateBinaryOperation(
        this.currentOperator,
        currentTemporaryValueNumber,
        currentValueNumber,
        this.alreadyDoneEqualOperation
      );

      this.setError(result === "divided_by_zero" ? "divided_by_zero" : "");

      if (!this.alreadyDoneEqualOperation) {
        this.setCurrentTemporaryValue(currentValueNumber);
        this.setAlreadyDoneEqualOperation(true);
      }

      if (typeof result === "string") {
        this.setCurrentValue(this.$t(result));
        return;
      }

      this.setFormattedCurrentValue(result);
    },
  },
});
</script>

<style lang="scss">
.calculator-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 290px;
  height: 550px;
  background-color: #150c24;
  border-radius: 24px;
  font-size: 24px;
  padding: 0 24px;
  background-image: linear-gradient(#325c7f, #6d5a7f, #bf6c86);
}
</style>
