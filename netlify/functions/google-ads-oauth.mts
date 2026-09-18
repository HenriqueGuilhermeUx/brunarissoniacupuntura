const CLIENT_ID = Netlify.env.get("GOOGLE_ADS_CLIENT_ID");
const REDIRECT_URI = "https://brunarissoniacupuntura.netlify.app/.netlify/functions/google-ads-oauth-callback";

export default async () => {
  if (!CLIENT_ID) return new Response("Google Ads OAuth não configurado.", { status: 500 });
  const state = crypto.randomUUID();
  const p = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/adwords",
    state
  });
  const headers = new Headers({
    Location: "https://accounts.google.com/o/oauth2/v2/auth?" + p.toString(),
    "Set-Cookie": "bruna_ads_oauth_state=" + encodeURIComponent(state) + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600"
  });
  return new Response(null, { status: 302, headers });
};
