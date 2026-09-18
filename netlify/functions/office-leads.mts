import { getStore } from "@netlify/blobs";
import { createHmac } from "node:crypto";
const sig=(v:string,s:string)=>createHmac("sha256",s).update(v).digest("hex");
function allowed(req:Request){
 const secret=Netlify.env.get("BRUNA_OFFICE_SESSION_SECRET");
 const part=(req.headers.get("cookie")||"").split(";").map(v=>v.trim()).find(v=>v.startsWith("bruna_office_session="));
 const raw=part?part.substring("bruna_office_session=".length):"";
 const [exp,signature]=raw.split(".");
 return Boolean(secret&&exp&&signature&&Number(exp)>Date.now()&&sig(exp,secret)===signature);
}
export default async(req:Request)=>{
 if(!allowed(req)) return new Response("Unauthorized",{status:401});
 const store=getStore("bruna-leads",{consistency:"strong"});
 const {blobs}=await store.list({prefix:"lead/"});
 const leads=[]; for(const b of blobs){const v=await store.get(b.key,{type:"json"});if(v)leads.push(v);}
 leads.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
 return Response.json({leads});
};