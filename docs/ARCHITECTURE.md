# Architecture and Best Practices

## Overview

This project is a simple scientific calculator built with Vue 3, TypeScript,
Vuex, and vue-i18n. The application is organized into Vue components, global
state in Vuex, pure services for calculation rules, typed constants for
calculator configuration, translations in JSON files, and unit tests.
Vue 3 also gives the project stronger TypeScript support for component and
store contracts.

The current architecture separates the main responsibilities:

- Vue components handle presentation, events, and binding to state.
- Vuex stores calculator state.
- Pure services handle math logic and result formatting.
- Constants centralize operators and button rows.
- Shared types document the contract between components, store, and services.
- Unit tests cover components, services, and the Vuex module.

## Data Flow

The calculator's main flow should remain unidirectional and predictable:

1. The user interacts with buttons or language controls.
2. Components emit events or call local handlers.
3. `CalculatorContainer.vue` interprets the UI intent.
4. Calculations and formatting are delegated to pure services.
5. Persistent calculator state is updated through Vuex actions/mutations.
6. Components re-render from getters, state, and translations.

As a general rule, derived values should be calculated close to the layer that
consumes them. The store should keep the minimum state needed to reconstruct
the calculator, avoiding duplicated information that can drift out of sync.

## Current Structure

- `src/main.ts` initializes Vue, Vuex, vue-i18n, and mounts the app.
- `src/App.vue` renders `CalculatorContainer`.
- `src/components/CalculatorContainer/CalculatorContainer.vue` coordinates the
  interface, button handlers, Vuex integration, and domain service calls.
- `src/components/CalculatorLineContent/CalculatorLineContent.vue` renders
  reusable button rows.
- `src/components/HeaderContent/HeaderContent.vue` shows the translated title
  and current value.
- `src/components/LanguagesContent/LanguagesContent.vue` lets the user change
  the active language.
- `src/store/index.ts` creates the Vuex store and registers the calculator
  module.
- `src/store/modules/calculator.ts` stores calculator state and exposes
  getters, mutations, and actions.
- `src/services/calculatorEngine.ts` contains pure math operations.
- `src/services/resultFormatter.ts` contains formatting rules, rounding,
  precision, and infinity handling.
- `src/constants/calculatorButtons.ts` centralizes button rows and special
  classes.
- `src/constants/calculatorOperators.ts` centralizes supported operators.
- `src/types/Calculator.ts` defines shared types such as `Operator`,
  `CalculatorErrorKey`, `CalculatorDisplayValue`, and `CalculatorState`.
- `src/locales` contains the available translations.
- `test-utils` contains reusable helpers for tests.

## Responsibilities

### Components

Components should remain focused on presentation, props, events, and Vuex
integration. They should avoid implementing math rules or complex formatting
rules.

Props should use `required`, `default`, and `PropType` when that helps TypeScript
document the component contract more clearly. Empty options such as
`components: {}` or `data: () => ({})` should be avoided when they do not add
behavior.

UI events should avoid browser-side effects. For example, links used as
controls should use `@click.prevent` or be replaced with `button` elements when
they do not represent real navigation.

`CalculatorContainer.vue` is the main orchestrator of the calculator. It ties
the UI to state, reacts to button events, and delegates calculations and
formatting to pure services.

When adding a new component, prefer:

- Small, explicit props.
- Domain-oriented event names such as `select-operator` or `change-locale`.
- Tests that validate observable behavior, not internal details.
- Local styles when the visual rule belongs only to that component.

### Store

Vuex is the source of truth for calculator state. It should store values such
as the current value, temporary value, memory, operator, error state, infinity,
and active language.

Recommended rules:

- Mutations should make small, predictable changes to state.
- Actions should stay simple while they only wrap mutations.
- State should store error keys, not final translated messages.
- Complex math logic should remain in services.
- Vuex module tests should validate getters, mutations, and actions without
  mounting components.

Avoid letting the store know presentation details such as CSS classes, button
row structure, or final translated text. Those decisions belong in components,
constants, or i18n.

### Services

Services should be pure functions whenever possible.

- `calculatorEngine.ts` contains operations such as addition, subtraction,
  multiplication, division, roots, powers, factorial, percentage, and `1/x`.
- `resultFormatter.ts` contains rules for precision, scientific notation,
  decimal places, and infinity handling.

These modules should be easy to test without Vue, Vuex, or i18n.

Expected service contracts:

- Receive primitive values or shared types.
- Return predictable results for the same inputs.
- Represent errors through keys or typed values, not translated messages.
- Do not access the DOM, store, i18n, or components directly.

### Constants

Static configuration should live in `src/constants`.

- `calculatorButtons.ts` defines the button rows shown by the calculator.
- `calculatorOperators.ts` defines the supported binary operators.

This reduces magic strings and makes it easier to reorganize the UI without
mixing configuration with calculation rules.

### Internationalization

Translations remain centralized in `src/locales`.

Good practice:

- Keep only error keys in state, such as `divided_by_zero`.
- Translate messages in the presentation/orchestration layer.
- Avoid storing already translated messages as the permanent source of truth.

When adding a new visible string, update every file in `src/locales` in the same
PR. This avoids silent regressions when the active language changes.

## Boundaries Between Layers

These boundaries help decide where to place new code:

- UI: layout, click events, accessibility, classes, and visual composition.
- Store: minimal state, predictable mutations, simple actions, and getters.
- Domain: math calculation, numeric validation, and value transformation.
- Formatting: display rules, rounding, precision, and infinity.
- i18n: final text shown to the user.

If a change needs to touch multiple layers, the dependency should flow from the
UI downward. Services should not import components, the store, or translation
files.

## Design Decisions

- Vue 3 remains the project's base; new changes should follow the existing
  component patterns used by the codebase today, while Composition API or
  `<script setup>` can be introduced where they improve clarity.
- Vuex remains the global state mechanism while the app is small and centered on
  a single calculator.
- Unit tests are preferred over end-to-end tests because most of the risk lives
  in calculation rules, formatting, and light Vuex integration.
- Generated artifacts such as `coverage/` and `dist/` are not part of the source
  architecture and should not be versioned.

## Tests

There are four main test levels:

- Component tests, to validate rendering, events, i18n, and Vuex integration.
- Service tests, to validate math rules and formatting in isolation.
- Vuex module tests, to validate getters, mutations, and actions directly.
- Playwright visual tests, to validate the rendered calculator shell and a few
  important user-facing states in the browser.

Test locations:

- `src/components/**/__tests__` for component specs.
- `src/services/__tests__` for pure service specs.
- `src/store/modules/__tests__` for Vuex module specs.
- `tests/visual` for browser-driven visual regression tests.

Covered scenarios include:

- Basic operations: addition, subtraction, multiplication, and division.
- Division by zero.
- Scientific operations: powers, roots, factorial, and `1/x`.
- Percentage.
- Repeated `=`.
- Calculator memory.
- Formatting of long results and infinity.
- Language switching for errors and infinity.
- Store getters, mutations, and actions.

Useful commands:

```bash
yarn test --runInBand
yarn test:coverage
yarn lint
yarn build
yarn test:visual
```

Notes:

- `coverage/` is a generated Jest artifact and is ignored in `.gitignore`.
- Guideline: current coverage is expected to stay near 100% for statements,
  lines, and functions, with branch coverage above 95%.

## Best Practices for Future Changes

- Separate UI, state, domain, and i18n.
- Prefer pure functions for math rules.
- Avoid magic strings scattered through the codebase.
- Keep components small and presentation-oriented.
- Declare props with explicit types, defaults, and required flags.
- Remove empty component options when they are not needed.
- Prevent unwanted native behavior in UI interactions, such as navigation
  caused by `href="#"`.
- Use shared types when a value crosses components, store, and services.
- Store error keys in state, not translated messages.
- Cover business rules with unit tests that do not depend on Vue.
- Use component tests to validate interaction and visual integration.
- Use direct store tests to protect the contract of getters, mutations, and
  actions.
- Use Playwright visual tests for the main calculator shell and the highest
  value browser states.
- Update this document when an architectural decision changes how the project
  evolves.

## Criteria for New Features

Before adding a new feature, confirm:

- Does the rule belong in the UI, the state, or the domain?
- Can the feature be expressed as a pure function?
- Are there suitable types to represent the new values?
- Do the new props and events have an explicit, testable contract?
- Should configuration live in `src/constants`?
- Do the user-facing messages need translation?
- Are there unit tests for the main cases and the expected errors?
- Does the new behavior need a component test, a service test, a store test,
  or a combination of them?

## When to Update This Document

Update this file when a change:

- Changes the main data flow.
- Creates, removes, or renames a relevant layer.
- Changes the contract between components, store, services, or i18n.
- Introduces a new testing convention.
- Adds a dependency that changes how the app is structured.

It is not necessary to update this document for small layout changes, text
changes, or internal refactors that preserve the contracts described here.
Coverage target changes should be treated as guidance updates rather than
architecture changes.

## Suggested Next Steps

1. Gradually reduce the orchestration responsibility of
   `CalculatorContainer.vue`, moving more complex flows into actions or
   dedicated helpers if the component grows again.
2. Continue tightening the typing of store helpers and component boundaries as
   the codebase evolves.
3. Review whether `currentResult` is still necessary or whether the display can
   be simplified using only `currentValue` and derived state.
4. Add unit tests for additional edge cases, such as factorial of non-integer
   numbers, negative values, and very large results.
5. Consider a naming convention for button events, replacing `handler1`,
   `handler2`, etc. with more explicit events if the UI grows.
