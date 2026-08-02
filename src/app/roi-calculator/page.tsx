import { ContentPage } from "@/components/layout/content-page";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "ROI Calculator",
  description:
    "Estimate break-even time and return on investment for futures prop firm evaluations.",
  path: "/roi-calculator",
});

export default function RoiCalculatorPage() {
  return (
    <ContentPage
      title="Prop firm ROI calculator"
      description="See how long it takes to recover your all-in eval cost."
    >
      <RoiCalculator />
    </ContentPage>
  );
}
