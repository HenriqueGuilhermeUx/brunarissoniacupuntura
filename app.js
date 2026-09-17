const qs=new URLSearchParams(location.search);
const attribution={utm_source:qs.get('utm_source')||'',utm_medium:qs.get('utm_medium')||'',utm_campaign:qs.get('utm_campaign')||'',utm_term:qs.get('utm_term')||'',utm_content:qs.get('utm_content')||'',gclid:qs.get('gclid')||''};
try{if(Object.values(attribution).some(Boolean))localStorage.setItem('br_attribution',JSON.stringify(attribution));}catch{}
function track(name,detail={}){try{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:name,...detail,...attribution});}catch{}}
document.querySelectorAll('[data-wa]').forEach(a=>a.addEventListener('click',()=>track('whatsapp_click',{placement:a.dataset.wa,href:a.href})));
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)track('faq_open',{question:d.querySelector('summary')?.textContent||''})}));
track('landing_view',{path:location.pathname});