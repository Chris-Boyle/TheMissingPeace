type RedisValue = string | number | boolean;

type RedisResponse<T> = {
  result?: T;
  error?: string;
};

type RedisPipelineResponse<T = unknown> = Array<RedisResponse<T>>;

function getRedisEnv(name: "UPSTASH_REDIS_REST_URL" | "UPSTASH_REDIS_REST_TOKEN") {
  const value = process.env[name];

  if (!value) {
    throw new Error("Missing Redis configuration.");
  }

  return value;
}

async function upstashFetch<T>(
  path: string,
  body: unknown
): Promise<T> {
  const url = `${getRedisEnv("UPSTASH_REDIS_REST_URL")}${path}`;
  const token = getRedisEnv("UPSTASH_REDIS_REST_TOKEN");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    console.error("Upstash request failed", {
      status: response.status,
      body: bodyText,
      path,
    });
    throw new Error("Redis request failed.");
  }

  return (await response.json()) as T;
}

export async function executeRedisCommand<T = unknown>(
  ...command: RedisValue[]
) {
  const payload = await upstashFetch<RedisResponse<T>>("/", command);

  if (payload.error) {
    console.error("Upstash command error", {
      command,
      error: payload.error,
    });
    throw new Error("Redis command failed.");
  }

  return payload.result;
}

export async function executeRedisPipeline<T = unknown>(
  commands: RedisValue[][]
) {
  const payload = await upstashFetch<RedisPipelineResponse<T>>(
    "/pipeline",
    commands
  );

  for (const result of payload) {
    if (result.error) {
      console.error("Upstash pipeline error", {
        commands,
        error: result.error,
      });
      throw new Error("Redis pipeline failed.");
    }
  }

  return payload.map((entry) => entry.result);
}
