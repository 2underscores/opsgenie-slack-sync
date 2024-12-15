import dotenv from 'dotenv';
import { exit } from 'process';
dotenv.config();
function getEnvVar(key) {
    const value = process.env[key];
    if (!value) {
        console.error(`Missing required environment variable: ${key}`);
        exit(1);
    }
    return value;
}
export const config = {
    opsgenieKey: getEnvVar('API_KEY_OPSGENIE'),
    slackKey: getEnvVar('SLACK_BOT_TOKEN'),
};
