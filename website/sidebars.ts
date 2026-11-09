import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  projectSidebar: [
    {
      type: "category",
      label: "Action-Flow IR Guide",
      items: [
        "guide/basic-structure",
        "guide/actions-and-connections",
        "guide/identifiers-and-references",
        "guide/metadata-and-provenance",
        "guide/variables-and-types",
      ],
    },
    {
      type: "category",
      label: "Language Specification",
      items: [
        "spec/README",
        "spec/document-envelope",
        "spec/actions",
        "spec/variables-and-types",
      ],
    },
    {
      type: "category",
      label: "Field Reference",
      items: [
        "reference/envelope",
        "reference/actions",
        "reference/variables-and-types",
      ],
    },
    {
      type: "category",
      label: "CLI",
      items: [
        "tutorials/validate-document",
        "tutorials/minimal-action",
        "reference/tooling",
      ],
    },
  ],
};

export default sidebars;
