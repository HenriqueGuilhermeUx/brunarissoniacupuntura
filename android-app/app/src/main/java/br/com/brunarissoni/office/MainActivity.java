package br.com.brunarissoni.office;
import android.app.*;import android.os.*;import android.webkit.*;import android.content.*;import android.net.Uri;import android.view.*;
public class MainActivity extends Activity{
 WebView web;
 final String HOME="https://brunarissoniacupuntura.netlify.app/office.html";
 @Override public void onCreate(Bundle b){super.onCreate(b);web=new WebView(this);setContentView(web);WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(web,true);web.setWebChromeClient(new WebChromeClient());web.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){Uri u=r.getUrl();String h=u.getHost();if(h!=null&&(h.equals("brunarissoniacupuntura.netlify.app")||h.endsWith(".google.com")||h.endsWith(".googleapis.com"))){return false;}startActivity(new Intent(Intent.ACTION_VIEW,u));return true;}});web.loadUrl(HOME);}
 @Override public void onBackPressed(){if(web.canGoBack())web.goBack();else super.onBackPressed();}
}
