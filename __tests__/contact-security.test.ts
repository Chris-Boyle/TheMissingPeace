/** @jest-environment node */

jest.mock("../src/lib/upstash-redis", () => ({
  executeRedisCommand: jest.fn(),
  executeRedisPipeline: jest.fn(),
}));

import {
  applyContactRateLimit,
  buildRateLimitHeaders,
  getBodySizeFromRequest,
  resetContactRateLimitStoreForTests,
} from "../src/lib/contact-security";
import {
  executeRedisCommand,
  executeRedisPipeline,
} from "../src/lib/upstash-redis";

describe("contact security helpers", () => {
  beforeEach(() => {
    (executeRedisCommand as jest.Mock).mockReset();
    (executeRedisPipeline as jest.Mock).mockReset();
  });

  it("uses durable Redis-backed rate limiting", async () => {
    (executeRedisPipeline as jest.Mock).mockResolvedValue([1, "OK"]);

    const result = await applyContactRateLimit(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "x-forwarded-for": "203.0.113.10",
        },
      })
    );

    expect(executeRedisPipeline).toHaveBeenCalledWith([
      ["INCR", "contact:rate-limit:203.0.113.10"],
      ["PEXPIRE", "contact:rate-limit:203.0.113.10", 600000],
    ]);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("builds retry headers from the rate limit reset time", () => {
    const headers = buildRateLimitHeaders(Date.now() + 30_000);

    expect(Number(headers["Retry-After"])).toBeGreaterThanOrEqual(1);
  });

  it("falls back to encoded body length when content-length is missing", () => {
    const request = new Request("http://localhost:3000/api/contact", {
      method: "POST",
    });

    expect(getBodySizeFromRequest(request, "hello")).toBe(5);
  });

  it("cleans up Redis-backed rate limit keys in tests", async () => {
    (executeRedisCommand as jest.Mock).mockResolvedValue(1);

    await resetContactRateLimitStoreForTests("203.0.113.10");

    expect(executeRedisCommand).toHaveBeenCalledWith(
      "DEL",
      "contact:rate-limit:203.0.113.10"
    );
  });
});
