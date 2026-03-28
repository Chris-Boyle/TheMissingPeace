import { executeRedisPipeline, executeRedisCommand } from "@/lib/upstash-redis";

const DEFAULT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 5;

export const CONTACT_SECURITY_CONFIG = {
  maxBodyBytes: 24_000,
  minimumCompletionMs: 4_000,
  maxLinksInMessage: 5,
  rateLimitWindowMs:
    Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS) ||
    DEFAULT_RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests:
    Number(process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS) ||
    DEFAULT_RATE_LIMIT_MAX_REQUESTS,
} as const;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  const fallbackIp = forwardedFor || vercelForwardedFor || realIp;

  if (fallbackIp) {
    return fallbackIp.split(",")[0]?.trim() || "unknown";
  }

  const userAgent = request.headers.get("user-agent") || "unknown";
  return `unknown:${userAgent.slice(0, 80)}`;
}

function getRateLimitKey(request: Request) {
  return `contact:rate-limit:${getClientIp(request)}`;
}

export async function applyContactRateLimit(request: Request) {
  const key = getRateLimitKey(request);
  const [count] = await executeRedisPipeline<number>([
    ["INCR", key],
    ["PEXPIRE", key, CONTACT_SECURITY_CONFIG.rateLimitWindowMs],
  ]);
  const currentCount = Number(count || 0);

  return {
    allowed: currentCount <= CONTACT_SECURITY_CONFIG.rateLimitMaxRequests,
    remaining: Math.max(
      CONTACT_SECURITY_CONFIG.rateLimitMaxRequests - currentCount,
      0
    ),
    resetAt: Date.now() + CONTACT_SECURITY_CONFIG.rateLimitWindowMs,
  };
}

export function getBodySizeFromRequest(request: Request, rawBody: string) {
  const contentLength = request.headers.get("content-length");
  const parsedLength = contentLength ? Number(contentLength) : NaN;

  if (Number.isFinite(parsedLength) && parsedLength > 0) {
    return parsedLength;
  }

  return new TextEncoder().encode(rawBody).length;
}

export function buildRateLimitHeaders(resetAt: number) {
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((resetAt - Date.now()) / 1000)
  );

  return {
    "Retry-After": String(retryAfterSeconds),
  };
}

export async function resetContactRateLimitStoreForTests(ip: string) {
  await executeRedisCommand("DEL", `contact:rate-limit:${ip}`);
}
