import dotenv from 'dotenv';
import { exit } from 'process';

dotenv.config();

function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        console.error(`Missing required environment variable: ${key}`);
        exit(1);
    }
    return value;
}

export const config = {
    opsgenie: {
        apiKey: getEnvVar('API_KEY_OPSGENIE'),
    },
    slack: {
        token: getEnvVar('SLACK_BOT_TOKEN'),
        channelId: getEnvVar('SLACK_CHANNEL_ID'),
        userGroupId: getEnvVar('SLACK_USERGROUP_ID'),
    },
} as const;

export type Config = typeof config;