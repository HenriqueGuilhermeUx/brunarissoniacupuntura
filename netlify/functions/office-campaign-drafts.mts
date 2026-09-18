import { getStore } from "@netlify/blobs";
import { createHmac } from "node:crypto";

function authorized(req: Request) {
  const secret = Netlify.env.get("BRUNA_OFFICE_SESSION_SECRET");
  const cookie = (req.headers.get("cookie") || "").split(";").map(v => v.trim()).find(v => v.startsWith("bruna_office_session="));
  const raw = cookie ? cookie.substring("bruna_office_session=".length) : "";
  const [exp, signature] = raw.split(".");
  if (!secret || !exp || !signature || Number(exp) <= Date.now()) return false;
  const expected = createHmac("sha256", secret).update(exp).digest("hex");
  return expected === signature;
}

export default async (req: Request) => {
  if (!authorized(req)) return new Response("Unauthorized", { status: 401 });
  const store = getStore("bruna-campaign-drafts", { consistency: "strong" });

  if (req.method === "GET") {
    const { blobs } = await store.list({ prefix: "draft/" });
    const drafts = [];
    for (const item of blobs) {
      const value = await store.get(item.key, { type: "json" });
      if (value) drafts.push(value);
    }
    drafts.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    return Response.json({ drafts });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    const id = String(body.id || crypto.randomUUID());
    const draft = {
      id,
      goal: String(body.goal || "").slice(0, 120),
      service: String(body.service || "").slice(0, 120),
      budget: Math.max(5, Number(body.budget) || 30),
      context: String(body.context || "").slice(0, 1000),
      status: "draft",
      updatedAt: new Date().toISOString()
    };
    await store.setJSON("draft/" + id, draft);
    return Response.json({ ok: true, draft });
  }

  return new Response("Method not allowed", { status: 405 });
};