import * as React from "react";

import { cn } from "@/lib/utils";

// Use React.InputHTMLAttributes<HTMLInputElement> directly for props type
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Base styles
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background",
        // File input specific styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Placeholder styles
        "placeholder:text-muted-foreground",
        // Focus visible styles for accessibility
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Disabled styles
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Your custom, more elegant styles can be merged here or kept as is
        // For example, if you prefer your original styling:
        // "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      ref={ref} // Pass the ref to the input element
      suppressHydrationWarning={true} // Add the fix for browser extension issues
      {...props}
    />
  );
});
Input.displayName = "Input"; // Add a display name for better debugging

export { Input };
