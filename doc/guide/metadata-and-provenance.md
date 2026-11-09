# Metadata and source provenance

Metadata describes the document for readers. Source provenance records the technology from which it originated. Both are optional in **0.1.0-draft.1**, **0.1.0-draft.2**, **0.1.0-draft.3**, **0.1.0-draft.4** and **0.1.0-draft.5**.

## A complete envelope

This valid draft.2 document includes descriptive information and no actions:

```json
{
  "irVersion": "0.1.0-draft.2",
  "id": "customer-actions",
  "metadata": {
    "title": "Customer actions",
    "description": "A collection of customer-related action declarations."
  },
  "source": {
    "technology": "outsystems",
    "version": "11"
  },
  "actions": []
}
```

You can place the action from [Basic structure](basic-structure.md#a-complete-document) in this document's `actions` array.

## Add metadata

`metadata.title` is a nonempty string without surrounding whitespace. `metadata.description` is a string that may be empty or contain newlines, represented as `\n` inside JSON strings. Both fields are optional, so an empty `metadata` object is valid.

Metadata belongs to the document. This draft does not define metadata on individual actions or nodes.

## Record the source

When you include `source`, provide `technology`. Use a lowercase identifier such as `outsystems`, `csharp`, or `javascript`; these are examples, not an exhaustive list. Hyphen-separated names such as `custom-platform` are allowed. Spaces and uppercase letters are not.

`source.version` is optional and describes the source technology's version. It is independent of `irVersion`. It must be a nonempty string without surrounding whitespace.

Source information is self-reported. It does not prove authenticity, select an adapter, or change the meaning of the flow. Omitting `source` leaves the origin unspecified. No importer or adapter is implemented by declaring this field.

## Common mistakes

| Value                                                            | Why it is invalid                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `"source": {}`                                                   | A source object requires `technology`.                                 |
| `"technology": "OutSystems"`                                     | Technology identifiers must be lowercase.                              |
| `"metadata": null`                                               | Optional fields must be omitted when unused; explicit null is invalid. |
| `"source": { "technology": "outsystems", "file": "Module.oml" }` | `file` is not a supported source property.                             |

See [ENV-004 through ENV-006](../spec/document-envelope.md#requirements) for exact rules and the [envelope field reference](../reference/envelope.md) for a compact summary. To check a saved document, use the separate [CLI guide](../tutorials/validate-document.md).
