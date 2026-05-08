"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TermsCheckbox } from "./TermsCheckbox";
import { SHIPPING_ZONES } from "@/lib/shipping";
import {
  shippingFormSchema,
  type ShippingFormValues,
} from "@/lib/validators";

interface Props {
  defaultZoneId: string;
  onSubmit: (values: ShippingFormValues) => void;
}

export function ShippingForm({ defaultZoneId, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      shippingZoneId: defaultZoneId,
      invoiceType: "boleta",
      documentType: "DNI",
      acceptedTerms: false as unknown as true,
    },
  });

  const invoiceType = watch("invoiceType");
  const acceptedTerms = watch("acceptedTerms");

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Datos de envío</legend>

        <Field label="Nombre" id="firstName" error={errors.firstName?.message}>
          <Input id="firstName" {...register("firstName")} autoComplete="given-name" />
        </Field>
        <Field label="Apellido" id="lastName" error={errors.lastName?.message}>
          <Input id="lastName" {...register("lastName")} autoComplete="family-name" />
        </Field>
        <Field label="Email" id="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register("email")} autoComplete="email" />
        </Field>
        <Field label="Teléfono" id="phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            placeholder="+51 9XX XXX XXX"
            {...register("phone")}
            autoComplete="tel"
          />
        </Field>
        <Field label="Dirección" id="address" className="sm:col-span-2" error={errors.address?.message}>
          <Input id="address" {...register("address")} autoComplete="street-address" />
        </Field>
        <Field label="Distrito" id="district" error={errors.district?.message}>
          <Input id="district" {...register("district")} />
        </Field>
        <Field label="Ciudad" id="city" error={errors.city?.message}>
          <Input id="city" {...register("city")} defaultValue="Lima" />
        </Field>
        <Field
          label="Referencia (opcional)"
          id="reference"
          className="sm:col-span-2"
          error={errors.reference?.message}
        >
          <Input id="reference" {...register("reference")} placeholder="Frente a la plaza, casa azul…" />
        </Field>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="shippingZoneId">Zona de envío</Label>
        <Select
          defaultValue={defaultZoneId}
          onValueChange={(v) => setValue("shippingZoneId", v, { shouldValidate: true })}
        >
          <SelectTrigger id="shippingZoneId" aria-invalid={!!errors.shippingZoneId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SHIPPING_ZONES.map((z) => (
              <SelectItem key={z.id} value={z.id}>
                {z.name} — S/ {z.price.toFixed(2)} ({z.minDeliveryDays}-{z.maxDeliveryDays} días)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.shippingZoneId && (
          <p className="text-xs text-destructive">{errors.shippingZoneId.message}</p>
        )}
      </div>

      <fieldset className="space-y-3 rounded-lg border p-4">
        <legend className="px-2 text-sm font-medium">Tipo de comprobante</legend>
        <RadioGroup
          defaultValue="boleta"
          onValueChange={(v) => {
            setValue("invoiceType", v as "boleta" | "factura", { shouldValidate: true });
            setValue("documentType", v === "factura" ? "RUC" : "DNI", { shouldValidate: true });
          }}
          className="flex gap-6"
        >
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="boleta" /> Boleta
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="factura" /> Factura (RUC)
          </label>
        </RadioGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={invoiceType === "factura" ? "RUC (11 dígitos)" : "DNI (8 dígitos)"}
            id="documentNumber"
            error={errors.documentNumber?.message}
          >
            <Input
              id="documentNumber"
              inputMode="numeric"
              {...register("documentNumber")}
              maxLength={11}
            />
          </Field>
          {invoiceType === "factura" && (
            <>
              <Field
                label="Razón social"
                id="companyName"
                error={errors.companyName?.message}
              >
                <Input id="companyName" {...register("companyName")} />
              </Field>
              <Field
                label="Dirección fiscal"
                id="fiscalAddress"
                className="sm:col-span-2"
                error={errors.fiscalAddress?.message}
              >
                <Input id="fiscalAddress" {...register("fiscalAddress")} />
              </Field>
            </>
          )}
        </div>
      </fieldset>

      <TermsCheckbox
        checked={acceptedTerms === true}
        onChange={(v) =>
          setValue("acceptedTerms", v as true, { shouldValidate: true })
        }
        error={errors.acceptedTerms?.message}
      />

      <Button type="submit" size="lg" className="w-full" disabled={!acceptedTerms}>
        Continuar al pago
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  children,
  className,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"space-y-1.5 " + (className ?? "")}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
