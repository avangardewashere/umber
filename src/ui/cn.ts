import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Joins class names and resolves Tailwind conflicts.
 *
 *   cn("p-2", "p-4")            -> "p-4"        (the later class wins)
 *   cn("a", false && "b", "c")  -> "a c"        (falsy values are dropped)
 *
 * Every Umber component uses this. It is the only helper a copied component
 * needs, so it ships alongside the component.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
