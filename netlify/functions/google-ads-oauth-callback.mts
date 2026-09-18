const REDIRECT_URI = "https://brunarissoniacupuntura.netlify.app/.netlify/functions/google-ads-oauth-callback";

function cookie(req, name) {
  const raw = req.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return "";
}

export default async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const expected = cookie(req, "bruna_ads_oauth_state");
  if (error) return Response.redirect("/office.html?google_ads=denied", 302);
  if (!code || !state || !expected || state !== expected) return new Response("OAuth inválido ou expirado.", { status: 400 });

  const clientId = Netlify.env.get("GOOGLE_ADS_CLIENT_ID");
  const clientSecret = Netlify.env.get("GOOGLE_ADS_CLIENT_SECRET");
  if (!clientId || !clientSecret) return new Response("Credenciais OAuth não configuradas.", { status: 500 });

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code"
  });
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const token = await tokenRes.json();
  if (!tokenRes.ok || !token.refresh_token) {
    console.error("Google OAuth token exchange failed", tokenRes.status, token?.error);
    return Response.redirect("/office.html?google_ads=token_error", 302);
  }

  // Never send tokens to the browser. Persisting the refresh token requires a
  // protected server-side store; until that is configured we only validate OAuth.
  return Response.redirect("/office.html?google_ads=authorized_not_persisted", 302);
};
