import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Animated loading spinner icon based on Loader2.
 *
 * @param {React.ComponentProps<"svg">} props - Standard SVG attributes
 * @param {string} [props.className] - Additional CSS classes to merge with the default size and animation
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
