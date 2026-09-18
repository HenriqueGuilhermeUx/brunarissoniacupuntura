export default async () => Response.json({
  googleAds:{configured:Boolean(Netlify.env.get("GOOGLE_ADS_CLIENT_ID")&&Netlify.env.get("GOOGLE_ADS_CLIENT_SECRET")&&Netlify.env.get("GOOGLE_ADS_CUSTOMER_ID")),authorized:false,reason:"oauth_pending"},
  leads:{storage:"netlify_blobs"}
});