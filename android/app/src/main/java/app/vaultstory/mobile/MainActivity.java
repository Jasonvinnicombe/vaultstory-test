package app.vaultstory.mobile;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleDeepLink(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleDeepLink(intent);
    }

    private void handleDeepLink(Intent intent) {
        Uri data = intent.getData();

        if (data == null || bridge == null || bridge.getWebView() == null) {
            return;
        }

        if (!"app.vaultstory.mobile".equals(data.getScheme()) || !"billing-return".equals(data.getHost())) {
            return;
        }

        String serverUrl = bridge.getServerUrl();
        if (serverUrl == null || serverUrl.isEmpty()) {
            return;
        }

        String query = data.getEncodedQuery();
        String targetUrl = serverUrl + "/settings" + (query != null && !query.isEmpty() ? "?" + query : "");

        bridge.getWebView().post(() -> bridge.getWebView().loadUrl(targetUrl));
    }
}
