import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const data = await req.formData();
  if (String(data.get("bot-field") || "")) return new Response(null, { status: 204 });
  const nome = String(data.get("nome") || "").trim().slice(0,120);
  const whatsapp = String(data.get("whatsapp") || "").trim().slice(0,40);
  const consent = String(data.get("consentimento_contato") || "");
  if (!nome || !whatsapp || consent !== "sim") return new Response("Dados inválidos", { status: 400 });
  const requestedId=String(data.get("lead_id")||"").trim();
  const id=/^[a-f0-9-]{20,50}$/i.test(requestedId)?requestedId:crypto.randomUUID();
  const lead = {
    id, nome, whatsapp, stage: "lead", createdAt: new Date().toISOString(),
    attribution: {
      utm_source:String(data.get("utm_source")||"").slice(0,160),
      utm_medium:String(data.get("utm_medium")||"").slice(0,160),
      utm_campaign:String(data.get("utm_campaign")||"").slice(0,200),
      utm_term:String(data.get("utm_term")||"").slice(0,200),
      utm_content:String(data.get("utm_content")||"").slice(0,200),
      gclid:String(data.get("gclid")||"").slice(0,300)
    }
  };
  await getStore("bruna-leads",{consistency:"strong"}).setJSON("lead/"+id,lead);
  return Response.json({ok:true,id});
};
