import { API_BASE } from "./config";

export async function* readSSELines(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        yield line;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAIChat(
  body: { question: string; source: string }
): Promise<Response> {
  return fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export async function fetchParseStream(
  runId: string,
  signal: AbortSignal
): Promise<Response> {
  return fetch(`${API_BASE}/parser/runs/${runId}/stream`, {
    credentials: "include",
    signal,
  });
}
