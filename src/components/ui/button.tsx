import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex min-h-6 shrink-0 touch-manipulation items-center justify-center gap-[var(--space-2)] whitespace-nowrap rounded-[var(--btn-radius)] border-[length:var(--border-width-thin)] border-solid text-center text-[length:var(--label)] leading-[var(--label-lh)] font-medium tracking-[var(--letter-spacing-wide)] no-underline select-none [transition:var(--transition-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--section-focus-ring)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[color:var(--section-border-decorative)] disabled:bg-transparent disabled:text-[var(--section-text-secondary)] aria-invalid:border-[color:var(--destructive)] aria-invalid:outline-[color:var(--section-focus-ring)] [@media(pointer:coarse)]:min-h-[var(--touch-target)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--icon-xs)]",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--control-fill)] bg-[var(--control-fill)] text-[var(--control-fill-text)] hover:border-[color:var(--control-hover)] hover:bg-[var(--control-hover)]",
        secondary:
          "border-[color:var(--section-border-interactive)] bg-[var(--control-subtle)] text-[var(--section-text)] hover:bg-transparent",
        outline:
          "border-[color:var(--section-border-interactive)] bg-transparent text-[var(--section-text)] hover:bg-[var(--control-fill)] hover:text-[var(--control-fill-text)]",
        ghost:
          "border-transparent bg-transparent text-[var(--section-text)] hover:border-[color:var(--section-border-decorative)] hover:bg-[var(--control-subtle)]",
        destructive:
          "border-[color:var(--destructive)] bg-[var(--destructive)] text-[var(--primitive-color-white)] hover:bg-[color-mix(in_oklab,var(--destructive)_88%,var(--surface-ink)_12%)]",
        link: "min-h-6 border-transparent bg-transparent px-0 text-[var(--section-text)] underline decoration-[length:var(--border-width-thin)] underline-offset-4 hover:decoration-2 hover:underline-offset-[0.375rem]",
      },
      size: {
        sm: "min-h-8 px-[var(--btn-padding-x-sm)] py-[var(--btn-padding-y-sm)]",
        default: "min-h-11 px-[var(--btn-padding-x)] py-[var(--btn-padding-y-sm)]",
        lg: "min-h-12 px-[var(--btn-padding-x-lg)] py-[var(--btn-padding-y-lg)]",
        icon: "size-[var(--touch-target)] min-h-[var(--touch-target)] p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
