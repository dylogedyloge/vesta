import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Store a mapping of slugs to IDs
const slugToIdMap = new Map<string, string>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function getIdFromSlug(slug: string) {
  // Try to get the ID from our mapping
  const id = slugToIdMap.get(slug);
  if (!id) {
    // If we don't have a mapping, assume the slug might be a numeric ID
    if (/^\d+$/.test(slug)) {
      return slug;
    }
    throw new Error('Invalid slug - no matching ID found');
  }
  return id;
}
