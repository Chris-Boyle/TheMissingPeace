import {
  executeRedisCommand,
  executeRedisPipeline,
} from "@/lib/upstash-redis";

export const CONSULTATION_SECURITY_CONFIG = {
  maxBodyBytes: 24_000,
  maxDateQueryLength: 32,
  bookingRateLimitWindowMs:
    Number(process.env.CONSULTATION_BOOKING_RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000,
  bookingRateLimitMaxRequests:
    Number(process.env.CONSULTATION_BOOKING_RATE_LIMIT_MAX_REQUESTS) || 5,
  availabilityRateLimitWindowMs:
    Number(process.env.CONSULTATION_AVAILABILITY_RATE_LIMIT_WINDOW_MS) ||
    60 * 1000,
  availabilityRateLimitMaxRequests:
    Number(process.env.CONSULTATION_AVAILABILITY_RATE_LIMIT_MAX_REQUESTS) || 30,
} as const;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  const candidate = forwardedFor || vercelForwardedFor || realIp;

  if (candidate) {
    return candidate.split(",")[0]?.trim() || "unknown";
  }

  return `unknown:${(request.headers.get("user-agent") || "unknown").slice(0, 80)}`;
}

function getRateLimitKey(request: Request, scope: "availability" | "booking") {
  return `consultation:rate-limit:${scope}:${getClientIp(request)}`;
}

export async function applyConsultationRateLimit(
  request: Request,
  scope: "availability" | "booking"
) {
  const windowMs =
    scope === "booking"
      ? CONSULTATION_SECURITY_CONFIG.bookingRateLimitWindowMs
      : CONSULTATION_SECURITY_CONFIG.availabilityRateLimitWindowMs;
  const maxRequests =
    scope === "booking"
      ? CONSULTATION_SECURITY_CONFIG.bookingRateLimitMaxRequests
      : CONSULTATION_SECURITY_CONFIG.availabilityRateLimitMaxRequests;
  const key = getRateLimitKey(request, scope);
  const [count] = await executeRedisPipeline<number>([
    ["INCR", key],
    ["PEXPIRE", key, windowMs],
  ]);
  const currentCount = Number(count || 0);

  return {
    allowed: currentCount <= maxRequests,
    remaining: Math.max(maxRequests - currentCount, 0),
    retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
  };
}

export function buildConsultationRateLimitHeaders(retryAfterSeconds: number) {
  return {
    "Retry-After": String(retryAfterSeconds),
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

export async function resetConsultationRateLimitForTests(
  scope: "availability" | "booking",
  ip: string
) {
  await executeRedisCommand("DEL", `consultation:rate-limit:${scope}:${ip}`);
}
