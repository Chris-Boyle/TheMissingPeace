export const DOULA_QUIZ_STORAGE_KEY = "the-missing-peace:doula-quiz";

export type StoredDoulaQuizResult = {
  answers?: Record<string, unknown>;
  resultKey?: string;
  resultHeadline?: string;
  resultSummary?: string;
  completedAt?: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function saveDoulaQuizResult(result: StoredDoulaQuizResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DOULA_QUIZ_STORAGE_KEY, JSON.stringify(result));
}

export function clearStoredDoulaQuizResult() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DOULA_QUIZ_STORAGE_KEY);
}

export function getStoredDoulaQuizResult() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(DOULA_QUIZ_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!isPlainObject(parsed)) {
      return null;
    }

    return {
      answers: isPlainObject(parsed.answers) ? parsed.answers : undefined,
      resultKey:
        typeof parsed.resultKey === "string" ? parsed.resultKey : undefined,
      resultHeadline:
        typeof parsed.resultHeadline === "string"
          ? parsed.resultHeadline
          : undefined,
      resultSummary:
        typeof parsed.resultSummary === "string"
          ? parsed.resultSummary
          : undefined,
      completedAt:
        typeof parsed.completedAt === "string" ? parsed.completedAt : undefined,
    } satisfies StoredDoulaQuizResult;
  } catch {
    return null;
  }
}
