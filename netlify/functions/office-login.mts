import { createHmac } from "node:crypto";
const sig=(v:string,s:string)=>createHmac("sha256",s).update(v).digest("hex");
export default async(req:Request)=>{
 if(req.method!=="POST") return new Response("Method not allowed",{status:405});
 const secret=Netlify.env.get("BRUNA_OFFICE_SESSION_SECRET");
 const password=Netlify.env.get("BRUNA_OFFICE_PASSWORD");
 if(!secret||!password) return new Response("Auth unavailable",{status:503});
 const body=await req.json().catch(()=>({}));
 if(String(body.password||"")!==password) return new Response("Unauthorized",{status:401});
 const exp=Date.now()+28800000;
 const value=String(exp)+"."+sig(String(exp),secret);
 return new Response(null,{status:204,headers:{"Set-Cookie":"bruna_office_session="+value+"; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800"}});
};