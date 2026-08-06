import type { ReactNode } from "react";

import { CalculationTooltip } from "@/components/ui/calculation-tooltip";

export function CalculatedValue({
  tooltip,
  children,
  className,
}: {
  tooltip: ReactNode | null;
  children: ReactNode;
  className?: string;
}) {
  if (!tooltip) {
    return <>{children}</>;
  }

  return (
    <CalculationTooltip content={tooltip} className={className}>
      {children}
    </CalculationTooltip>
  );
}
