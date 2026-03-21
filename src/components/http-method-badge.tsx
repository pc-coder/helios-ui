import { cn } from "@/lib/utils"

const methodColors: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  PATCH:
    "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
}

interface HttpMethodBadgeProps {
  method: string
  className?: string
}

export function HttpMethodBadge({ method, className }: HttpMethodBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-semibold",
        methodColors[method.toUpperCase()] ?? "bg-muted text-muted-foreground",
        className
      )}
    >
      {method.toUpperCase()}
    </span>
  )
}
