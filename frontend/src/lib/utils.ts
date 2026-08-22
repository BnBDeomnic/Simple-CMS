import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Strips HTML tags and decodes entities (e.g. &mdash;) for post preview excerpts. */
export function excerpt(html: string, maxLength = 160): string {
  const stripped = html.replace(/<[^>]+>/g, " ")
  const textarea = document.createElement("textarea")
  textarea.innerHTML = stripped
  const text = textarea.value.replace(/\s+/g, " ").trim()
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "…"
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
