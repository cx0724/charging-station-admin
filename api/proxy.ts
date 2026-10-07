import type { IncomingMessage, ServerResponse } from "node:http";

type VercelRequest = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
};

type VercelResponse = ServerResponse & {
  status: (statusCode: number) => VercelResponse;
  send: (body: Buffer | string) => void;
};

const contextHeaders = {
  "X-Order-No": "API_ORDER_NO",
  "X-Phone": "API_PHONE",
  "X-Name": "API_NAME",
} as const;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const backendUrl = process.env.API_BACKEND_URL;
  const requestedPath = request.query?.path;
  const apiPath = Array.isArray(requestedPath)
    ? requestedPath.join("/")
    : requestedPath;

  if (!backendUrl || !apiPath) {
    response.status(500).send("API proxy is not configured");
    return;
  }

  const upstreamUrl = new URL(
    apiPath,
    backendUrl.endsWith("/") ? backendUrl : `${backendUrl}/`,
  );
  const headers: Record<string, string> = {
    "Content-Type": String(request.headers["content-type"] || "application/json"),
  };
  if (typeof request.headers.authorization === "string") {
    headers.Authorization = request.headers.authorization;
  }
  for (const [headerName, environmentName] of Object.entries(contextHeaders)) {
    const value = process.env[environmentName];
    if (value) headers[headerName] = value;
  }

  const method = request.method || "GET";
  const hasBody = !["GET", "HEAD"].includes(method);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
      body: hasBody && request.body !== undefined ? JSON.stringify(request.body) : undefined,
    });
    const contentType = upstreamResponse.headers.get("content-type");
    if (contentType) response.setHeader("Content-Type", contentType);
    response.status(upstreamResponse.status).send(
      Buffer.from(await upstreamResponse.arrayBuffer()),
    );
  } catch {
    response.status(502).send("Unable to reach the upstream API");
  }
}
