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
        <p>Tooling foundation available. No IR version is supported yet.</p>
        <Link to="/docs/spec/">Read the specification status</Link>
      </main>
    </Layout>
  );
}
