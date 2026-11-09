import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

export default function Home(): ReactNode {
  return (
    <Layout
      title="Action-Flow IR"
      description="Write Action-Flow IR documents and validate their structure"
    >
      <main className="container margin-vert--xl">
        <h1>Action-Flow IR</h1>
        <p>
          A typed, language-independent representation of application logic.
        </p>
        <p>
          IR 0.1.0-draft.4 adds typed expressions and linear assignments.
          Draft.1, draft.2 and draft.3 validation remains available.
        </p>
        <p>
          <Link to="/docs/guide/basic-structure">
            Write your first IR document
          </Link>
        </p>
        <p>
          <Link to="/docs/guide/computation">Compute and assign values</Link>
        </p>
        <p>
          <Link to="/docs/spec/">Read the language specification</Link>
        </p>
        <p>
          <Link to="/docs/tutorials/validate-document">
            Validate a document with the CLI
          </Link>
        </p>
      </main>
    </Layout>
  );
}
