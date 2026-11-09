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
          IR 0.1.0-draft.5 adds Boolean branches, direct joins and definite
          initialization. Draft.1 through draft.4 validation remains available.
        </p>
        <p>
          <Link to="/docs/guide/basic-structure">
            Write your first IR document
          </Link>
        </p>
        <p>
          <Link to="/docs/guide/branches">Branch and join paths</Link>
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
