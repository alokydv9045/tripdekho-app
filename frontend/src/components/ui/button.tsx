import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-amber-500 text-black shadow-sm hover:bg-amber-400 hover:-translate-y-0.5 hover:shadow-md active:scale-95 active:translate-y-0",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-md active:scale-95 active:translate-y-0",
        outline:
          "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-md active:scale-95 active:translate-y-0",
        secondary:
          "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-100/80 hover:-translate-y-0.5 hover:shadow-md active:scale-95 active:translate-y-0",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-amber-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-2",
        sm: "h-9 rounded-xl px-4 text-[10px]",
        lg: "h-16 rounded-[2rem] px-10",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
