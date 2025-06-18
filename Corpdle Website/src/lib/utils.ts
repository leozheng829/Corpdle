import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Normalize a string for answer comparison
export function normalizeAnswer(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "") // remove all whitespace
    .replace(/[-_]/g, "") // remove dashes and underscores
    .replace(/[^a-z0-9]/g, ""); // remove all non-alphanumeric
}

// Levenshtein distance implementation
export function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = [];
  for (let i = 0; i <= bn; ++i) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= an; ++j) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

// Check if user input is close enough to the correct answer
export function isCloseEnough(
  userInput: string,
  correctAnswer: string,
  threshold: number = 1
): boolean {
  const normUser = normalizeAnswer(userInput);
  const normCorrect = normalizeAnswer(correctAnswer);
  return (
    normUser === normCorrect || levenshtein(normUser, normCorrect) <= threshold
  );
}
