import { getStore } from "@netlify/blobs";
export default async (req: Request) => {
  const auth=req.headers.get("authorization")||"";
  const key=Netlify.env.get("BRUNA_OFFICE_API_KEY");
  if(!key || auth!=="Bearer "+key) return new Response("Unauthorized",{status:401});
  const store=getStore("bruna-leads",{consistency:"strong"});
  const {blobs}=await store.list({prefix:"lead/"});
  const leads=[]; for(const b of blobs){const v=await store.get(b.key,{type:"json"}); if(v)leads.push(v);}
  leads.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  return Response.json({leads});
};
