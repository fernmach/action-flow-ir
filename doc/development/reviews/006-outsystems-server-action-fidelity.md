# Step 6: OutSystems Server Action extraction and fidelity review

Date: 2026-11-09
Status: read-only extraction and initial mapping review complete; branch implementation pending
Related iteration: [Step 6 branches](../iterations/006-branches.md)

## Evidence and scope

The user authorized read-only extraction of the five Server Actions in the open test module AFIR_TR_ServiceAction_Tests. These are purpose-built fixtures previously created for this project, not production application coverage. The module's Service style is distinct from the objects' action kind: every requested export identifies itself as IServerAction, not IServiceAction. The existing Service Actions were not requested as fixtures and were not modified.

Calls used the existing authorized MCP session: getSerializedObjectByNameAndType with objectType OutSystems.Model.Logic.IServerAction, listApps, getValidationMessages and supplementary read-only runQuery queries. No edit session, Model API mutation, merge, publication or execution was performed during extraction. No adapter or textual expression parser was implemented.

Raw evidence is local-only under the git-ignored directory:

```text
out/outsystems/AFIR_TR_ServiceAction_Tests/2026-11-09-server-actions/
```

The manifest records each requested object, extraction timestamps, raw-response SHA-256 digests and native-payload digests. Original HTTP MCP response bodies remain unchanged as `.mcp-response.sse` files. `.content.json` files decode the transport content envelope; `.native.json` files additionally remove only the returned Markdown JSON fence, preserving the inner JSON text rather than reformatting it. Authorization tokens are not included in evidence or request metadata.

The supplementary ModelQL response and its request are retained alongside the exports. identity-map.json associates action/declaration/node keys with native JSON pointers; mapping-inventory.json describes the captured graphs. Reads were sequential observations, not an atomic module snapshot. Cross-checks matched action names, node counts, unique per-action coordinates, declaration names and connector counts between both representations.

Native exports are intentionally outside public examples and the conformance corpus. This review records conclusions without copying raw object keys or module payloads into published language documentation. Ignored evidence must be retained separately if moving the review to another checkout.

## Captured actions

| Server Action                  | Nodes | If nodes | Assignment nodes | Edges | Native shape and intended AFIR use                                                                                 |
| ------------------------------ | ----- | -------- | ---------------- | ----- | ------------------------------------------------------------------------------------------------------------------ |
| CalculateDiscount_Server       | 5     | 1        | 2                | 5     | Discount initialized before branch; false arm directly joins end; Step 6 positive candidate                        |
| CalculateDiscountByRate_Server | 6     | 1        | 3                | 6     | Both arms initialize Rate; join directly at Discount assignment; Step 6 positive candidate                         |
| ClassifyRequest_Server         | 12    | 4        | 6                | 15    | Nested branches; four incoming edges at a branch condition; two incoming edges at end; Step 6 positive candidate   |
| EmptyConditional_Server        | 3     | 0        | 1                | 2     | Approved simplified start → Result := 1 → end; manually mapped draft.4 study validates now                         |
| OneArmAssignmentProbe_Server   | 4     | 1        | 1                | 4     | False arm reaches end without assigning Result; expected negative under AFIR's authored-flow initialization policy |

Total: 30 nodes, 7 If nodes, 13 assignment nodes, 32 edges and 15 declarations (8 inputs, 5 outputs, 2 locals). Every exported assignment contains exactly one update. Every captured coordinate target resolves within its action, with no duplicate node coordinates. All eight inputs are mandatory in the supplementary query. All captured declarations have empty configured-default expressions in that query; this does not imply uninitialized runtime values.

Native validation returns zero errors and seven warnings: five unused Server Actions, plus an unused Flag input in the simplified Server Action and in the retained Service Action. OneArmAssignmentProbe_Server has no design-time initialization error. No runtime input/output results were collected.

## Proposed mapping

This table describes an explicit translation boundary. It does not change AFIR validation or adopt an adapter contract.

| Native representation                               | Proposed AFIR representation                                    | Fidelity consideration                                                                                                                              |
| --------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| IServerAction and its Name                          | Action declaration                                              | Keep action kind verified independently of module style; retain native key in a mapping sidecar                                                     |
| InputParameters / OutputParameters / LocalVariables | inputs / outputs / locals                                       | Missing native LocalVariables collection means no declared locals in these captures; emit AFIR's required empty array explicitly during translation |
| Declaration Name / DataType                         | name and primitive type                                         | Decimal, Integer and Boolean names correspond structurally here; native type-domain behavior is not established by those names alone                |
| Native parameter/node keys from ModelQL             | Stable AFIR IDs or persisted ID mapping                         | Primary JSON alone lacks these keys; never treat canvas position as durable identity                                                                |
| IStartNode / IEndNode                               | start / end                                                     | Preserve one of each; find entry by node kind rather than array position                                                                            |
| IAssignNode.Assignments[0]                          | assign.targetVariableId and value                               | Resolve the textual destination to its declaration; one update per node is observed here, not guaranteed for arbitrary native actions               |
| IIfNode.Condition                                   | Proposed branch.condition                                       | Requires Step 6; infer/check Boolean through an explicitly constructed expression tree                                                              |
| Target                                              | Unlabeled connection                                            | Native endpoints are coordinate strings in the primary export                                                                                       |
| TrueTarget / FalseTarget                            | Proposed connections with true / false labels                   | Labels are derived from named source fields, not inferred from target positions or connector ordering                                               |
| Native expression strings                           | AFIR typed expression trees                                     | Manual review is needed now; no general parser is supplied or assumed                                                                               |
| X/Y and coordinate-string endpoints                 | Resolve snapshot-local graph, then map endpoints to native keys | Preserve layout as source evidence only; layout is not AFIR execution order                                                                         |
| IsMandatory string True in primary JSON             | Verified required-input observation                             | Supplementary query returns Boolean true; neither spelling belongs as an undeclared field in current AFIR                                           |
| Empty/omitted configured defaults                   | Fidelity finding, not implicit AFIR initialization              | Do not insert defaults or assume absence means runtime undefined                                                                                    |

For this capture, the supplement provides UUID-like keys for objects, while some type and connector references are serialized in a different global-reference form. Preserve those references rather than equating or rewriting their encodings blindly. Node keys were associated with the primary export through unique coordinates within each action; coordinate correspondence is only for this capture. After relayout, use fresh metadata and persistent native IDs, not previous coordinate-derived identities.

## Expression review

The exported conditions/values are source strings, not typed ASTs. Examples and their manually reviewed interpretations are:

| Source text                  | Candidate AFIR tree and type                                     |
| ---------------------------- | ---------------------------------------------------------------- |
| IsPremium                    | variable reference to Boolean input                              |
| IsPremium and Total >= 100.0 | Boolean and, with Decimal greaterThanOrEqual on the right        |
| Total * 0.10                 | Decimal multiply of the Total reference and Decimal literal 0.10 |
| Total * Rate                 | Decimal multiply of two references                               |
| Score >= 80 / Score >= 50    | Integer greaterThanOrEqual                                       |
| Tier >= 2                    | Integer greaterThanOrEqual after convergence                     |
| Result := 1                  | Integer assignment to declared Integer output in these fixtures  |

The fixture's native Decimal constants explicitly use decimal notation, including 0.0 and 100.0. Retain literal spelling when constructing AFIR literals. The type of an arbitrary native literal/expression cannot be inferred safely from spelling alone: obtain typed source information or review it in context. A future adapter needs separate scope for expression parsing/type resolution, identifiers, coercions, operator precedence and unsupported functions/constructs.

This capture exercises only three primitive type names and small arithmetic values. It does not establish Text/Unicode fidelity, native numeric range/precision/rounding/overflow behavior, or equivalence to AFIR's unbounded Integer and exact finite base-10 domains. Exact mathematical AFIR meaning must not be inferred from the tool's textual expression export or from JavaScript numbers.

## Concrete fidelity findings

### Direct joins match the proposed graph model

The captured Rate flow joins two assignments at a later assignment. ClassifyRequest joins four Tier assignments directly at another If, then joins two output writes at end. These native graphs support Step 6's direct-join and all-predecessor initialization design. They do not require explicit merge nodes or paired branch/join syntax in AFIR.

The current draft.4 implementation cannot consume those branches: it requires a linear path and forbids branch kinds. Preserve those graphs for Step 6; do not flatten them or drop a path to make them pass draft.4. Positive classifications above are design-review expectations, not observed draft.5 validation results.

### Output initialization is an intentional mapping question

The one-arm export visibly assigns Result only on the true arm, and native TrueChange accepts it. Its supplementary DefaultValue field is empty, as for the other output/local declarations. Empty configured-default metadata does not prove absence of type-level platform initialization; runtime false-path behavior was not measured.

A direct authored-flow translation into the proposed AFIR model must remain a negative initialization case: Result is absent from the false path's initialized set. This is a difference between native design-time acceptance and AFIR's explicit rule, not a reason to weaken AFIR validation or add a zero assignment silently.

Before semantic-preserving import is claimed, choose an explicit mapping policy: either reject/document dependence on native implicit initialization, or separately specify native defaults and lower them into explicit, traceable AFIR initialization nodes. The latter is future adapter/normalization work requiring verified semantics, not part of this review. The three positive branch fixtures initialize every observable output and read local on the relevant paths, so they can test Step 6 without resolving arbitrary native-default lowering first.

### Same-target outcomes lack a native fixture

In the preceding creation tasks (conversation evidence, not new extraction calls), non-saving Model API probes rejected setting the If false target to the same assignment as the true target, for both Service Actions and Server Actions. The user approved simplifying EmptyConditional to its three-node assignment flow. The current JSON export confirms that no If remains; it is not evidence that native serialization supports parallel true/false edges to one target.

This is an observed restriction of the tested Model API creation route, not proof that every Service Studio interaction or platform version has the same restriction. The user-confirmed AFIR same-target decision remains intact. Test it with a synthetic core conformance fixture at Step 6 rather than falsely labeling the simplified action as a native same-target example.

### Additional boundaries

- Native node assignments are arrays, but all thirteen here have one member. Do not assume the ordering/update semantics of arbitrary multiple-assignment nodes from this sample.
- Graph IDs, layout and model provenance need a sidecar or future explicit provenance extension; current AFIR permits only document-level source metadata, not arbitrary native fields.
- The module's exported version is not a verified platform version. The manual study specifies source.technology as outsystems and omits source.version.
- Nested branches do not prove coverage of every acyclic or crossing graph, invalid cycle, label error or path-local recovery case. Independent synthetic conformance cases are still required.

## Manual draft.4 validation study

The ignored `manual-study/EmptyConditional_Server.afir.json` document was manually specified from the three-node export, using supplementary native keys as AFIR IDs and mapping its known Integer literal 1 explicitly. No initializer or default was inserted. identity-map.json retains the source pointers. This is one reviewed fixture, not a reusable adapter or public example.

The existing validator was rebuilt, then the compiled CLI was exercised in JSON mode:

| Input                                             | Exit / status | Observed result                                                     |
| ------------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| Raw EmptyConditional_Server.native.json           | 1 / invalid   | AFIR-VERSION-001 at /irVersion; native JSON is not an AFIR document |
| Manually mapped EmptyConditional_Server.afir.json | 0 / valid     | Empty diagnostics                                                   |

Exact command arguments and result objects are retained in ignored validation-results.json. Passing the second document establishes draft.4 structural/type/flow validity for that reviewed mapping, not runtime evaluation, automatic translation correctness or general OutSystems equivalence. No draft.5 document was submitted as though it were supported.

## Verification and implementation path

Completed: five raw exports; supplementary identity/default query; manifest/digests; all native coordinate endpoints resolved; graph/key associations cross-checked; current TrueChange recorded; one manual draft.4 validation study. No schema, validator, conformance corpus or public example changed.

Checks ran from `C:\Projects\action-flow-ir`, using installed Node 24.22.1 on PATH for the existing CLI/build commands. In the commands below, `<capture>` denotes the local evidence directory listed above; validation-results.json records the full arguments without placeholders.

| Command / check                                                                                       | Observed result                                                                                        | Limitations                                                           |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Read-only MCP extraction/query calls                                                                  | Five IServerAction exports, key/default metadata and validation messages saved                         | Sequential native-model observations, not runtime execution           |
| SHA-256 / JSON / coordinate association checks via bun run -                                          | Fifteen original digests match; all five native JSON documents parse; 30 nodes and 32 edges associated | Supplemental key association uses unique coordinates in this capture  |
| bun run build                                                                                         | Passed                                                                                                 | Existing validator compilation; no source changes                     |
| node dist/cli/main.js validate <capture>/EmptyConditional_Server.native.json --format json            | Expected exit 1, AFIR-VERSION-001                                                                      | Native JSON is not AFIR                                               |
| node dist/cli/main.js validate <capture>/manual-study/EmptyConditional_Server.afir.json --format json | Exit 0, valid, no diagnostics                                                                          | One manual draft.4 mapping, not an adapter or behavior comparison     |
| Targeted Prettier check, relative Markdown target check and git diff --check                          | Passed; 30 relative targets resolve across four changed development documents                          | No raw evidence reformatted; review/development pages are GitHub-only |
| bun run docs:build                                                                                    | Passed; production static generation/link checks succeed                                               | Public-site regression build does not render development records      |

The build emitted the existing nonfatal Docusaurus update-notifier config-store notice.

Full conformance tests were not rerun because no implementation, schema, corpus or public example changed. The focused mapping study and documentation/evidence checks are the applicable verification for this review.

Next:

1. Use the three positive native branch graphs as source evidence when finalizing Step 6's representation, direct joins and initialization rules. Hand-author AFIR acceptance expectations separately.
2. Preserve OneArmAssignmentProbe as a native-accepted/authored-flow-AFIR-negative case with the initialization gap stated explicitly. Do not promise a lossless importer until default semantics/mapping are separately specified.
3. Retain a synthetic AFIR same-target case and native-restriction note. Confirm remaining condition/label, diagnostic, recovery and resource choices before implementation.
4. Implement Step 6 and validate reviewed branch translations against its actual schema/passes. Keep extraction, mapping checks and AFIR validity as separate outcomes.
5. Scope adapter development and runtime comparisons separately if requested. No module publication or execution is authorized by this review.

The purpose-built native-target design review is complete; behavioral fidelity, platform default values, broader native coverage and draft.5 conformance remain unverified. This evidence satisfies the initial native-model inspection opportunity, not completion of Step 6 or the first usable milestone.

## Step 6 implementation follow-up (2026-11-09)

The sections above retain the original read-only review and its then-current draft.4 limitations. After draft.5 implementation, four more manual mappings were authored from these captured graphs and supplementary identities. Their nodes, declarations, expression interpretations and labeled endpoints were checked against the source association sidecar. Known native Decimal literal spellings were retained; no defaults, extra writes or flow repairs were inserted. The capture itself was not changed or refreshed.

The compiled CLI was rebuilt and run with JSON output against each ignored manual-study mapping; exact arguments and results are in draft5-validation-results.json:

| Manual mapping                                  | Exit / status | Observed result                                        |
| ----------------------------------------------- | ------------- | ------------------------------------------------------ |
| CalculateDiscount_Server.draft5.afir.json       | 0 / valid     | Both output-writing arms pass                          |
| CalculateDiscountByRate_Server.draft5.afir.json | 0 / valid     | Both-arm local initialization and assignment join pass |
| ClassifyRequest_Server.draft5.afir.json         | 0 / valid     | Nested branches and direct branch/end joins pass       |
| OneArmAssignmentProbe_Server.draft5.afir.json   | 1 / invalid   | Exactly AFIR-INIT-001 at /actions/0/outputs/0/id       |

The simplified EmptyConditional retains its original valid draft.4 mapping. Same-target outcomes are covered by synthetic draft.5 conformance cases, since the native fixture has no branch. All fifteen original raw/native/supplementary digests were rechecked. New derived mapping/result digests are recorded separately in the ignored manifest.

These observations establish static validity or the expected initialization failure for the reviewed translations. They do not establish runtime equivalence, numeric behavior, native implicit-default semantics or a reusable importer. Private native keys and payloads remain outside public examples. Step 6's full implementation verification is recorded in [ITER-006](../iterations/006-branches.md).
