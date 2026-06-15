import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional Tailwind class names. Always use this instead of template
 * literals or string concatenation for className values.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
