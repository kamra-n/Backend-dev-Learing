const { GoogleAuth } = require('google-auth-library');

/**
 * Fetches a short-lived (1 hour) OAuth2 access token for FCM
 */
async function getAccessToken() {
    const auth = new GoogleAuth({
        keyFile: './brandsvalley-2ea4d-firebase-adminsdk-fbsvc-ba3f6d79bb.json',
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });

    try {
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();

        console.log("--- ACCESS TOKEN ---");
        console.log(tokenResponse.token);
        return tokenResponse.token;
    } catch (error) {
        console.error("Error generating token:", error);
    }
}

getAccessToken();