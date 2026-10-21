// MealSync UI kit components (import from "components/ui"). Every screen builds on these so the app looks consistent.
// Clean & light: white surfaces, zinc neutrals, hairline borders,
// Skystone red (brand-600) reserved for primary actions and key states.

import {
  forwardRef,
  useEffect,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

import { createPortal } from "react-dom";

import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  cn,
} from "./styles";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

// ==========================================
// BUTTON
// ==========================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      className,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors",
          BUTTON_VARIANTS[variant],
          BUTTON_SIZES[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);

// ==========================================
// CARD
// ==========================================

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

// ==========================================
// PAGE HEADER
// ==========================================

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-sm font-medium text-zinc-500">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-zinc-500 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

// ==========================================
// BADGE
// ==========================================

const BADGE_TONES = {
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  warning: "bg-amber-50 text-amber-800 ring-amber-100",
  danger: "bg-red-50 text-red-700 ring-red-100",
  info: "bg-sky-50 text-sky-700 ring-sky-100",
} as const;

export type BadgeTone = keyof typeof BADGE_TONES;

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        BADGE_TONES[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

// ==========================================
// STAT
// ==========================================

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: "neutral" | "brand";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        {icon && (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              tone === "brand"
                ? "bg-brand-50 text-brand-600"
                : "bg-zinc-100 text-zinc-500"
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-sm text-zinc-500">{hint}</p>}
    </Card>
  );
}

// ==========================================
// FEEDBACK
// ==========================================

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("animate-spin text-zinc-400", className)}
      size={22}
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          {icon}
        </div>
      )}
      <p className="font-medium text-zinc-900">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

const CALLOUT_TONES = {
  neutral: "border-zinc-200 bg-zinc-50 text-zinc-700",
  brand: "border-brand-100 bg-brand-50 text-brand-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-900",
} as const;

export function Callout({
  tone = "neutral",
  icon,
  title,
  children,
  action,
  className,
}: {
  tone?: keyof typeof CALLOUT_TONES;
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
        CALLOUT_TONES[tone],
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <div className="min-w-0 text-sm">
          {title && <p className="font-semibold">{title}</p>}
          {children && <div className={cn(Boolean(title) && "mt-0.5", "opacity-90")}>{children}</div>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ==========================================
// FORMS
// ==========================================

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-zinc-800"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

const CONTROL =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-brand-600 focus:ring-3 focus:ring-brand-600/15 focus:outline-none disabled:bg-zinc-50 disabled:text-zinc-500";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { leading?: ReactNode }
>(function Input({ className, leading, ...props }, ref) {
  if (!leading) {
    return <input ref={ref} className={cn(CONTROL, "h-10", className)} {...props} />;
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
        {leading}
      </span>
      <input ref={ref} className={cn(CONTROL, "h-10 pl-9", className)} {...props} />
    </div>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(CONTROL, "h-10 pr-8", className)} {...props}>
      {children}
    </select>
  );
});

// ==========================================
// SEGMENTED CONTROL
// ==========================================

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition",
            value === option.value
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ==========================================
// WEEK SWITCHER
// ==========================================

export function WeekSwitcher({
  label,
  sublabel,
  onPrevious,
  onNext,
  canPrevious = true,
  canNext = true,
}: {
  label: ReactNode;
  sublabel?: ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious?: boolean;
  canNext?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-card">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Previous week"
        onClick={onPrevious}
        disabled={!canPrevious}
        icon={<ChevronLeft size={18} />}
      />
      <div className="min-w-[150px] px-2 text-center leading-tight">
        <p className="text-sm font-semibold text-zinc-900">{label}</p>
        {sublabel && <p className="text-xs text-zinc-500">{sublabel}</p>}
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Next week"
        onClick={onNext}
        disabled={!canNext}
        icon={<ChevronRight size={18} />}
      />
    </div>
  );
}

// ==========================================
// TABLE
// ==========================================

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5 text-xs font-medium tracking-wide text-zinc-500 uppercase",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-b border-zinc-100 px-5 py-3 align-middle", className)}>
      {children}
    </td>
  );
}

// ==========================================
// AVATAR
// ==========================================

export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700 ring-1 ring-brand-100",
        size === "sm" && "h-7 w-7 text-xs",
        size === "md" && "h-9 w-9 text-sm",
        size === "lg" && "h-14 w-14 text-lg"
      )}
    >
      {initials}
    </span>
  );
}

// ==========================================
// MODAL
// ==========================================

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-pop sm:rounded-2xl",
          size === "sm" && "sm:max-w-md",
          size === "md" && "sm:max-w-lg",
          size === "lg" && "sm:max-w-2xl"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={onClose}
            icon={<X size={18} />}
          />
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 bg-zinc-50/60 px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
