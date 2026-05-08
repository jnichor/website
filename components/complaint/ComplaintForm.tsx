"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { complaintSchema, type ComplaintInput } from "@/lib/validators";

export function ComplaintForm() {
  const [submitted, setSubmitted] = useState<{ complaintNumber: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintInput>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      type: "reclamo",
      goodType: "producto",
      isMinor: false,
      documentType: "DNI",
    },
  });

  const isMinor = watch("isMinor");

  const onSubmit = async (values: ComplaintInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al enviar el reclamo");
      }
      const data = (await res.json()) as { complaintNumber: string };
      setSubmitted(data);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border bg-green-50 p-6 text-green-900">
        <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden />
        <h2 className="mt-3 font-display text-xl font-bold">Reclamo registrado</h2>
        <p className="mt-2 text-sm">
          Tu número de reclamo es{" "}
          <span className="font-mono font-bold">{submitted.complaintNumber}</span>. Te enviaremos una
          copia al email registrado. Por ley, tenemos un plazo máximo de 15 días hábiles para
          responder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <fieldset className="space-y-3 rounded-lg border p-4">
        <legend className="px-2 text-sm font-medium">Tipo</legend>
        <RadioGroup
          defaultValue="reclamo"
          onValueChange={(v) => setValue("type", v as "reclamo" | "queja")}
          className="flex gap-6"
        >
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="reclamo" /> Reclamo (disconformidad con el producto/servicio)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="queja" /> Queja (malestar respecto a la atención)
          </label>
        </RadioGroup>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombres y apellidos" id="fullName" error={errors.fullName?.message}>
          <Input id="fullName" {...register("fullName")} />
        </Field>
        <Field label="Tipo de documento" id="documentType" error={errors.documentType?.message}>
          <Select
            defaultValue="DNI"
            onValueChange={(v) =>
              setValue("documentType", v as ComplaintInput["documentType"])
            }
          >
            <SelectTrigger id="documentType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DNI">DNI</SelectItem>
              <SelectItem value="CE">CE</SelectItem>
              <SelectItem value="Pasaporte">Pasaporte</SelectItem>
              <SelectItem value="RUC">RUC</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Número de documento" id="documentNumber" error={errors.documentNumber?.message}>
          <Input id="documentNumber" {...register("documentNumber")} inputMode="numeric" />
        </Field>
        <Field label="Email" id="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register("email")} />
        </Field>
        <Field label="Teléfono" id="phone" error={errors.phone?.message}>
          <Input id="phone" {...register("phone")} placeholder="+51 9XX XXX XXX" />
        </Field>
        <Field label="Dirección" id="address" error={errors.address?.message}>
          <Input id="address" {...register("address")} />
        </Field>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isMinor}
            onCheckedChange={(v) => setValue("isMinor", v === true)}
          />
          Soy menor de edad
        </label>
        {isMinor && (
          <Field label="Nombre del padre/madre/tutor" id="guardianName">
            <Input id="guardianName" {...register("guardianName")} />
          </Field>
        )}
      </div>

      <fieldset className="space-y-3 rounded-lg border p-4">
        <legend className="px-2 text-sm font-medium">Bien contratado</legend>
        <RadioGroup
          defaultValue="producto"
          onValueChange={(v) => setValue("goodType", v as "producto" | "servicio")}
          className="flex gap-6"
        >
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="producto" /> Producto
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="servicio" /> Servicio
          </label>
        </RadioGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Monto reclamado (S/)" id="amount" error={errors.amount?.message}>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label="Descripción del bien"
            id="description"
            className="sm:col-span-2"
            error={errors.description?.message}
          >
            <Input id="description" {...register("description")} />
          </Field>
        </div>
      </fieldset>

      <Field
        label="Detalle del reclamo (hechos)"
        id="detail"
        error={errors.detail?.message}
      >
        <Textarea id="detail" rows={4} {...register("detail")} />
      </Field>
      <Field
        label="Pedido del consumidor"
        id="request"
        error={errors.request?.message}
      >
        <Textarea id="request" rows={3} {...register("request")} />
      </Field>

      {serverError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Enviando…
          </>
        ) : (
          "Enviar reclamo"
        )}
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
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
