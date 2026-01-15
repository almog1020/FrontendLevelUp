/**
 * Stable color mapping for genre pie chart
 * Ensures each genre always gets the same color regardless of order or filters
 */

/**
 * Normalize genre label for consistent color mapping
 * Handles variations like "Role Playing", "Role-Playing", "role playing", etc.
 */
function normalizeLabel(label: string): string {
  // First normalize: lowercase, trim, replace spaces/hyphens with single hyphen
  let normalized = label
    .trim()
    .toLowerCase()
    .replace(/[-\s_]+/g, "-") // Replace spaces, hyphens, underscores with single hyphen
    .replace(/[^a-z0-9-]/g, ""); // Remove special characters
  
  // Also create a version without hyphens for matching
  const withoutHyphens = normalized.replace(/-/g, "");
  
  return normalized;
}

/**
 * Generate a deterministic color from a string hash
 * Uses a simple hash function to convert string to HSL color
 */
function hashToColor(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate HSL color with good saturation and lightness
  const hue = Math.abs(hash) % 360;
  const saturation = 60 + (Math.abs(hash) % 20); // 60-80%
  const lightness = 45 + (Math.abs(hash) % 15); // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Predefined colors for common genres
 * Includes multiple variations to handle different API formats
 */
const GENRE_COLORS: Record<string, string> = {
  shooter: "#e74c3c",           // Red
  adventure: "#3498db",         // Blue
  "role-playing": "#9b59b6",     // Purple
  "roleplaying": "#9b59b6",       // Purple (no hyphen)
  rpg: "#9b59b6",                // Purple (alias)
  strategy: "#2ecc71",           // Green
  simulator: "#f39c12",          // Orange
  other: "#95a5a6",             // Gray (neutral)
};

/**
 * Get a stable, deterministic color for a genre label
 * - "Other" always returns gray
 * - Common genres use predefined colors
 * - Unknown genres get a hash-based deterministic color
 * 
 * @param label - Genre name (case-insensitive)
 * @returns Hex or HSL color string
 */
export function getGenreColor(label: string): string {
  const normalized = normalizeLabel(label);
  const withoutHyphens = normalized.replace(/-/g, "");
  
  // "Other" must always be gray
  if (normalized === "other" || withoutHyphens === "other") {
    return GENRE_COLORS.other;
  }
  
  // Check if genre has a predefined color (with or without hyphens)
  if (GENRE_COLORS[normalized]) {
    return GENRE_COLORS[normalized];
  }
  if (GENRE_COLORS[withoutHyphens]) {
    return GENRE_COLORS[withoutHyphens];
  }
  
  // Special handling for role-playing variations
  if (normalized.includes("role") && normalized.includes("play")) {
    return GENRE_COLORS["role-playing"];
  }
  
  // Generate deterministic color for unknown genres
  return hashToColor(normalized);
}

