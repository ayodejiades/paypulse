"use client";

import { useRef, useState, useTransition } from "react";
import { submitRecord, submitReminder } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewRecordForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <Button data-demo="new" onClick={() => setOpen(true)}>
        New record
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      className="flex items-center gap-2"
      action={(formData) => {
        startTransition(async () => {
          const result = await submitRecord(formData);
          if (result.ok) {
            formRef.current?.reset();
            setOpen(false);
          }
        });
      }}
    >
      <Input data-demo="title" name="title" placeholder="Lagos pilot" autoFocus required />
      <Button data-demo="submit" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Submit"}
      </Button>
    </form>
  );
}

export function ReminderForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-2"
      action={(formData) => {
        startTransition(async () => {
          const result = await submitReminder(formData);
          if (result.ok) {
            formRef.current?.reset();
            setError(null);
          } else {
            setError(result.error ?? "something went wrong");
          }
        });
      }}
    >
      <div className="flex items-center gap-2">
        <Input data-demo="title" name="title" placeholder="Lagos pilot invoice" autoFocus required />
        <input
          data-demo="due-at"
          type="datetime-local"
          name="dueAt"
          className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-1.5 text-sm text-[var(--fg)]"
        />
        <Button data-demo="submit" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Schedule"}
        </Button>
      </div>
      {error ? (
        <p data-demo="form-error" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </form>
  );
}
