import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

export default function Home(): ReactNode {
  return (
    <Layout
      title="Action-Flow IR"
      description="Specification and validator development"
    >
      <main className="container margin-vert--xl">
        <h1>Action-Flow IR</h1>
        <p>
          A typed, language-independent representation of application logic.
        </p>
        <p>
          IR 0.1.0-draft.1 envelope validation is available. Actions remain
          future work.
        </p>
        <Link to="/docs/spec/">Read the specification status</Link>
      </main>
    </Layout>
  );
}
