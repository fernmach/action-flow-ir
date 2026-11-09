# ADR-005: Expressions and linear assignment

Status: accepted
Date: 2026-11-09
Related iterations: [Step 4](../development/iterations/004-expressions.md) and [Step 5](../development/iterations/005-assignment.md)
Supersedes / superseded by: none

## Context and options

Expressions need a consuming site. Independent delivery would require an artificial container or another feature. Implicit numeric promotion, multiple updates per node, constant-based read exemptions and recovery by assuming failed writes succeed add semantic ambiguity.

## Decision

The user approved the joint implementation plan and semantic defaults. Deliver expressions and assignment together as draft.4, with separate acceptance records. Use strict inline expression trees, explicit literal types, inferred reference/operator types, exact matching numeric/assignment types, plain numeric strings and one write per node. Evaluation is pure, left-to-right and short-circuiting, while static checks inspect all operands. Track initialization along finite linear graphs, checking pre-state reads and output completion. Inputs remain read-only.

Stop dependent initialization analysis after the first invalid assignment, retaining independent checks. Duplicate variable IDs/names suppress dependent scope checks; graph checks and Text scalar validation remain independent. Use conditional schema branches and remove only redundant draft.4 Ajv if wrappers. Before draft.4 schema validation, iteratively enforce 128 container levels and 100,000 containers; report tool-error AFIR-LIMIT-001. Preserve earlier versions exactly. No evaluator, numeric library, conversion, division, branch, adapter or execution engine is introduced.

## Consequences and follow-up

The [expression](../spec/expressions.md) and [assignment](../spec/assignment.md) chapters adopt EXP-001–008 and ASN-001–007 with diagnostic/traceability contracts. Draft.4 enables typed output-producing examples. Step 6 must extend flow and initialization to branches/merges before accepting them. Limits protect implementation resources without restricting mathematical numeric domains. Runtime semantics are specified but not proved by static validation.
