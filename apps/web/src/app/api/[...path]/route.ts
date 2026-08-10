import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = process.env.ARMONIA_API_PROXY || "http://127.0.0.1:8000";

async function proxy(req: NextRequest, path: string[]) {
  const target = `${API.replace(/\/$/, "")}/api/${path.join("/")}${req.nextUrl.search}`;
  const headers = new Headers();
  const pass = ["accept", "accept-language", "content-type", "cookie", "authorization", "user-agent"];
  for (const key of pass) {
    const v = req.headers.get(key);
    if (v) headers.set(key, v);
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch (err) {
    const message = err instanceof Error ? err.message : "upstream_unreachable";
    return NextResponse.json(
      { error: "API unreachable", code: "api_unreachable", detail: message, target: API },
      { status: 502 },
    );
  }

  const out = new NextResponse(upstream.body, { status: upstream.status });
  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "transfer-encoding" || k === "content-encoding" || k === "content-length") return;
    if (k === "set-cookie") return;
    out.headers.set(key, value);
  });
  const anyHeaders = upstream.headers as Headers & { getSetCookie?: () => string[] };
  const cookies = typeof anyHeaders.getSetCookie === "function" ? anyHeaders.getSetCookie() : [];
  if (cookies.length) {
    for (const c of cookies) out.headers.append("set-cookie", c);
  } else {
    const single = upstream.headers.get("set-cookie");
    if (single) out.headers.append("set-cookie", single);
  }
  return out;
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function OPTIONS(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
