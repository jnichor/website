"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}

export function TermsCheckbox({ checked, onChange, error }: Props) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          aria-describedby={error ? "terms-error" : undefined}
          aria-invalid={!!error}
        />
        <span>
          He leído y acepto los{" "}
          <Link href="/terminos" className="underline hover:text-primary" target="_blank">
            Términos y Condiciones
          </Link>{" "}
          y la{" "}
          <Link href="/privacidad" className="underline hover:text-primary" target="_blank">
            Política de Privacidad
          </Link>
          .
        </span>
      </label>
      {error && (
        <p id="terms-error" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
