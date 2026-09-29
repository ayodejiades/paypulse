// workflow-tool: Queue on the left, the selected case moving through the demo-path steps on the right. For products that move a case through stages: approvals, reconciliations, ops runbooks.
// Every word and number comes from lib/landing.ts (brief.json, docs/demo-path.json and the
// fixture). Reorder or swap the sections below to fit the product.
import { loadLanding } from "@/lib/landing";
import { Footer, Frame, Hero, Nav, Problem, StepsRail } from "@/components/landing/sections";

export default function Landing() {
  const d = loadLanding();
  return (
    <Frame d={d}>
      <Nav d={d} />
      <main className="flex flex-col">
        <Hero d={d} layout="split" />
        <StepsRail d={d} />
        <Problem d={d} />
      </main>
      <Footer d={d} />
    </Frame>
  );
}
