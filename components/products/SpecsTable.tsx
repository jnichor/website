import type { Spec } from "@/lib/types";

export function SpecsTable({ specs }: { specs: Spec[] }) {
  return (
    <table className="w-full overflow-hidden rounded-md border text-sm">
      <tbody>
        {specs.map((s, i) => (
          <tr key={s.label} className={i % 2 === 0 ? "bg-muted/40" : "bg-background"}>
            <th scope="row" className="w-1/3 px-4 py-3 text-left font-medium text-muted-foreground">
              {s.label}
            </th>
            <td className="px-4 py-3 text-foreground">{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
