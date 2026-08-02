"use client";

import { cn } from "@/lib/utils";

export const adminSelectClassName = cn(
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
);

export const adminInputClassName = cn(
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
);

export function AdminFormFields() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField name="name" label="Firm name" required />
      <FormField
        name="slug"
        label="Slug"
        required
        placeholder="my-prop-firm"
      />
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className={cn(adminInputClassName, "h-auto min-h-20 py-2")}
        />
      </div>
      <FormField
        name="websiteUrl"
        label="Website URL"
        type="url"
        placeholder="https://"
      />
      <div className="flex items-center gap-2 sm:col-span-2">
        <input type="hidden" name="isActive" value="true" />
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked
          value="true"
          className="size-4 rounded border-input"
        />
        <label htmlFor="isActive" className="text-sm">
          Active (visible on site)
        </label>
      </div>
    </div>
  );
}

function FormField({
  name,
  label,
  required,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={adminInputClassName}
      />
    </div>
  );
}
