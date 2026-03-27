/**
 * data/badges.ts
 * Performance badge definitions and helper to resolve
 * which badge a score percentage earns.
 */

import type { Badge } from "../types";

export const BADGES: Badge[] = [
    { min: 0,  max: 39,  label: "Keep Trying!", emoji: "💪" },
    { min: 40, max: 59,  label: "Good Effort!", emoji: "👍" },
    { min: 60, max: 79,  label: "Well Done!",   emoji: "⭐" },
    { min: 80, max: 89,  label: "Excellent!",   emoji: "🏆" },
    { min: 90, max: 100, label: "Champion!",    emoji: "🎉" },
];

/**
 * Returns the badge earned for a given score percentage.
 * Falls back to the first badge if no range matches.
 */
export const getBadge = (pct: number): Badge =>
    BADGES.find((b) => pct >= b.min && pct <= b.max) ?? BADGES[0];