// Class helpers shared by the UI kit and screens (kept out of the
// component file so React Fast Refresh keeps working).

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const BUTTON_VARIANTS = {
  primary:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 disabled:bg-brand-600/50",
  secondary:
    "border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50 disabled:text-zinc-400",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:text-zinc-300",
  danger:
    "border border-zinc-200 bg-white text-red-700 shadow-sm hover:border-red-200 hover:bg-red-50 disabled:text-red-300",
} as const;

export const BUTTON_SIZES = {
  sm: "h-8 gap-1.5 rounded-md px-3 text-sm",
  md: "h-10 gap-2 rounded-lg px-4 text-sm",
  lg: "h-12 gap-2 rounded-lg px-6 text-base",
  icon: "h-9 w-9 justify-center rounded-lg",
} as const;

// For links that should look like buttons (e.g. react-router <Link>)
export function buttonStyles(
  variant: keyof typeof BUTTON_VARIANTS = "primary",
  size: keyof typeof BUTTON_SIZES = "md",
  className?: string
) {
  return cn(
    "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors",
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className
  );
}
