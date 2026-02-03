import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean
  minRows?: number
}

function Textarea({
  className,
  resize = true,
  minRows = 3,
  style,
  ...props
}: TextareaProps) {
  const minHeight = minRows * 27 // Aproximadamente 24px por línea

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:border-gray-600",
        resize ? "resize-y" : "resize-none",
        className
      )}
      style={{
        minHeight: `${minHeight}px`,
        ...style,
      }}
      {...props}
    />
  )
}

export { Textarea }