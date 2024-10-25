require('dotenv').config();
const {
    google
} = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const {
    authenticate
} = require('@google-cloud/local-auth');

const CREDENTIALS_PATH = path.join(__dirname, '../utils/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../utils/token.json');

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        // Access token's expiration check
        const currentTime = new Date().getTime();
        if (client.credentials.expiry_date < currentTime) {
            try {
                await client.refreshAccessToken();
                await saveCredentials(client);
            } catch (err) {
                console.error('Failed to refresh access token:', err);
            }
        }
        return client;
    }
    client = await authenticate({
        scopes: [
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.send'
        ],
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

async function createGmailClient() {
    try {
        const auth = await authorize();
        const gmail = google.gmail({
            version: 'v1',
            auth
        });
        return gmail;
    } catch (error) {
        console.error('Failed to create Gmail client:', error);
        throw new Error('Failed to create Gmail client');
    }
}

module.exports = createGmailClient;