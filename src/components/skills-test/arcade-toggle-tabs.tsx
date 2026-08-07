"use client";

import { cn } from "@/lib/utils";

export type ArcadeToggleTabOption<T extends string | number> = {
  value: T;
  label: string;
  description?: string;
};

type ArcadeToggleTabsProps<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly ArcadeToggleTabOption<T>[];
  ariaLabel: string;
  variant?: "default" | "compact";
  className?: string;
  panelId?: string;
};

export function ArcadeToggleTabs<T extends string | number>({
  value,
  onChange,
  options,
  ariaLabel,
  variant = "default",
  className,
  panelId,
}: ArcadeToggleTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "arcade-toggle-tabs",
        variant === "compact" && "arcade-toggle-tabs--compact",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            id={`${panelId ?? ariaLabel}-tab-${option.value}`}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "arcade-toggle-tabs__tab",
              isActive && "arcade-toggle-tabs__tab--active",
            )}
          >
            <span className="arcade-toggle-tabs__label">{option.label}</span>
            {option.description ? (
              <span className="arcade-toggle-tabs__desc">{option.description}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
