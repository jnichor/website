import { CreditCard } from "lucide-react";
import type { InstallmentPlan } from "@/lib/types";
import { formatPrice, pluralCuotas } from "@/lib/utils";

export function InstallmentBadge({ plans }: { plans: InstallmentPlan[] }) {
  if (!plans.length) return null;
  const longest = plans.reduce((acc, p) => (p.months > acc.months ? p : acc), plans[0]);
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm">
      <CreditCard className="h-4 w-4 text-primary" aria-hidden />
      <span>
        o {pluralCuotas(longest.months)} de{" "}
        <span className="font-semibold">{formatPrice(longest.monthly)}</span> sin interés
      </span>
    </div>
  );
}
