# ADR-004: Variables and primitive types

Status: accepted
Date: 2026-11-09
Related iteration: [ITER-003](../development/iterations/003-variables-and-types.md)
Supersedes / superseded by: none

## Context

Step 3 needs a language-independent declaration model before expressions and assignment. Host-language numeric types and OutSystems defaults must not silently define IR behavior.

## Options

Explicit initialization or automatic type defaults; non-nullable primitives or nullable types; portable ASCII names or flexible Unicode names; exact mathematical numbers or bounded host-like numeric domains were considered. Defaults simplify returns but hide assignment obligations. Bounded domains require precision and overflow policies before any numeric operations exist.

## Decision

The user selected and explicitly authorized implementation of four non-nullable primitives (Boolean, Integer, Decimal, Text), exact mathematical numeric domains, portable unique names, one action-wide variable scope and explicit initialization. Inputs begin initialized and read-only; outputs and locals begin uninitialized. IDs and names are separately unique across all declaration categories. IDs identify future references independently of display names.

Enforce initialized outputs at normal completion now. Since the only graph is start → end, output-bearing actions are invalid until assignment support arrives. This avoids accepting an already-specified rule without enforcement. Numeric literals and operations are deferred, rather than borrowing JavaScript number semantics. Text is a sequence of Unicode scalar values.

## Consequences and follow-up

The [normative rules](../spec/variables-and-types.md) define the required arrays, strict declarations, type domains, scope, access, initialization and staged diagnostics. Draft.3 receives its own schema; both earlier drafts remain unchanged. Migration requires three explicit arrays and a version change. Step 4 must specify value encoding and operator behavior; Step 5 enables valid output-producing actions. No execution engine or numeric library is necessary for declarations.
