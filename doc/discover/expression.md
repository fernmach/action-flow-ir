I recommend **structured expression trees embedded directly where a value is needed**. Each expression is a literal, a variable reference, or an operator applied to other expressions.

That fits the project’s language independence, works naturally with JSON Schema, and lets the validator report errors at precise JSON Pointers. The expression model can be designed now; assignment and branch nodes will later provide places to use it.

Everything below is a design proposal.

**1. Use a small, explicit expression model**

Start with four forms:

| Form       | Purpose                 | Required fields                     |
| ---------- | ----------------------- | ----------------------------------- |
| `literal`  | A typed constant        | `kind`, `type`, `value`             |
| `variable` | Read an action variable | `kind`, `variableId`                |
| `unary`    | Apply a unary operator  | `kind`, `operator`, `operand`       |
| `binary`   | Apply a binary operator | `kind`, `operator`, `left`, `right` |

Objects should reject unknown fields. Expression trees do not need their own IDs: their position identifies them for diagnostics, and they are not independently referenced declarations.

Use `variableId` rather than `name` to preserve the identity policy adopted in Step 3.

For example, reading `total`:

```json
{
  "kind": "variable",
  "variableId": "total"
}
```

A Decimal constant:

```json
{
  "kind": "literal",
  "type": "Decimal",
  "value": "0.10"
}
```

**2. Declare types on literals; infer them everywhere else**

The validator should derive a reference’s type from its declaration and an operator’s result type from its operands.

For `Total * 0.10`:

```json
{
  "kind": "binary",
  "operator": "multiply",
  "left": {
    "kind": "variable",
    "variableId": "total"
  },
  "right": {
    "kind": "literal",
    "type": "Decimal",
    "value": "0.10"
  }
}
```

If `total` is Decimal, the expression produces Decimal. If it is Text, validation fails at the incompatible operand.

Adding `"type": "Decimal"` to every expression would introduce redundant information that could disagree with the inferred type. Keep inferred types in the validator’s internal analysis results.

**3. Preserve exact literal values**

I recommend these representations:

| Type    | Example JSON value     | Reason                                |
| ------- | ---------------------- | ------------------------------------- |
| Boolean | `true`                 | JSON already represents it exactly    |
| Integer | `"9007199254740993"`   | Avoid loss through JavaScript numbers |
| Decimal | `"0.10"`               | Preserve exact base-10 values         |
| Text    | `"Preferred customer"` | Natural JSON representation           |

For the first version, numeric strings could use ordinary decimal notation, excluding exponent notation, surrounding whitespace, separators, NaN and infinities. Specify the exact grammar before implementation.

Allow trailing fractional zeros in Decimal literals: `"0.10"` and `"0.1"` represent the same numeric value. This does **not** introduce a money scale or rounding policy. Validation preserves the original document.

Text literals must enforce Step 3’s Unicode scalar-value domain, including rejecting unpaired surrogate escapes.

**4. Keep the operator set deliberately small**

A useful initial set would be:

| Operators                                                          | Operand types                         | Result            |
| ------------------------------------------------------------------ | ------------------------------------- | ----------------- |
| `negate`                                                           | Integer or Decimal                    | Same numeric type |
| `not`                                                              | Boolean                               | Boolean           |
| `add`, `subtract`, `multiply`                                      | Two Integers or two Decimals          | Same numeric type |
| `equal`, `notEqual`                                                | Two values of the same primitive type | Boolean           |
| `lessThan`, `lessThanOrEqual`, `greaterThan`, `greaterThanOrEqual` | Matching numeric types                | Boolean           |
| `and`, `or`                                                        | Boolean, Boolean                      | Boolean           |

Require matching numeric types initially. For example, Decimal multiplied by an Integer literal is invalid; the author can use a Decimal literal instead. Conversion of Integer variables can be introduced explicitly when a concrete example needs it.

Defer division: finite base-10 decimals are not closed under division—`1 / 3` immediately requires another policy. Addition, subtraction and multiplication remain exact within the existing domains.

Also defer text ordering, concatenation, function calls and conditional expressions until needed.

**5. Specify evaluation independently of implementation**

Trees establish grouping, so there is no textual precedence or parser to define.

For example, the eligibility condition `IsPremium and Total >= 100` becomes:

```json
{
  "kind": "binary",
  "operator": "and",
  "left": {
    "kind": "variable",
    "variableId": "isPremium"
  },
  "right": {
    "kind": "binary",
    "operator": "greaterThanOrEqual",
    "left": {
      "kind": "variable",
      "variableId": "total"
    },
    "right": {
      "kind": "literal",
      "type": "Decimal",
      "value": "100"
    }
  }
}
```

I recommend pure expressions with deterministic, left-to-right evaluation. `and` and `or` should short-circuit.

**Static validation should still inspect both operands.** An unresolved variable inside `false and …` remains invalid. Initially, require every referenced variable to be definitely initialized at the expression’s use site, without attempting to prove that a short-circuited operand cannot execute.

That keeps validity predictable and avoids needing a constant evaluator.

**6. Implement expression analysis separately from flow analysis**

The implementation can remain small:

1. **Schema:** validate recursive expression shapes, literal representations and operator arity.
2. **Resolution:** resolve variable IDs within the containing action.
3. **Type checking:** infer result types and enforce the operator table.
4. **Initialization analysis:** use the surrounding flow’s initialized-variable set to check reads.

An unresolved reference should suppress dependent operand/result-type errors while independent sibling errors continue to be reported.

The expression checker should return an inferred type when known and diagnostics. It should not execute the expression, update variables, or independently decide which variables are initialized. Those responsibilities belong to the consuming node and flow analysis.

Use an iterative traversal or an explicit supported-depth limit so deeply nested JSON cannot cause an unclassified stack overflow. Any analysis limit must produce a tool limitation, rather than declaring the expression invalid.

This gives us a useful expression language without requiring an interpreter or decimal arithmetic library yet. The first decision I would settle is **whether matching numeric types are sufficient initially, or whether explicit Integer-to-Decimal conversion belongs in the first operator set**. That choice affects both authoring convenience and the size of the initial specification.

Yes—the type is declared in the action’s variable declarations. The expression references that declaration by ID.

For example, the containing action would have:

```json
"inputs": [
  {
    "id": "isPremium",
    "name": "IsPremium",
    "type": "Boolean"
  },
  {
    "id": "total",
    "name": "Total",
    "type": "Decimal"
  }
]
```

When the validator encounters:

```json
{
  "kind": "variable",
  "variableId": "isPremium"
}
```

it resolves `isPremium` within that action and obtains **Boolean** from its declaration. An unknown ID produces an unresolved-reference error.

The types in your expression therefore follow this chain:

```text
isPremium                    → Boolean, from its declaration
total                        → Decimal, from its declaration
literal "100"                → Decimal, explicitly declared
total >= Decimal("100")      → Boolean, from the operator's rule
isPremium and (total >= 100) → Boolean
```

A literal needs an explicit type because it has no separate declaration. In particular, `"100"` could represent Text, Integer, or Decimal.

Keeping the type only in the variable declaration gives it one authoritative source. Repeating it in each reference could introduce contradictions—for example, declaring `isPremium` as Boolean but annotating a reference as Decimal.

So the proposed expression model is **typed**, even though every expression object does not carry an explicit `type` field. References obtain their types through resolution; operators obtain theirs through type inference.

In the current **draft.3**, optional inputs and input default values are **not supported**.

Every declared input is assumed to have an initialized value when the action starts. There are no `optional` or `default` fields; adding them would produce a schema error.

For the first expressions increment, I recommend keeping that policy:

- All declared inputs require a supplied value.
- No implicit defaults exist.
- Expressions can read inputs because they are initialized at entry.

We should introduce optional inputs when designing **action calls**, where omitted arguments become meaningful. At that point, a useful initial rule would be: **an input may be omitted only if it declares a default**. The default supplies its value before the action body starts.

Optional inputs without defaults need another decision: whether absence means null, an explicit optional value, or an uninitialized variable. Our current non-nullable types do not provide an absence value.

For OutSystems inputs with defaults, this is therefore a known fidelity gap to record. We should preserve that distinction when mapping real actions rather than silently treating those inputs as required.
