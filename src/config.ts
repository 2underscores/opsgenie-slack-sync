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
    jsm: {
        cloudId: getEnvVar('CLOUD_ID'),
        baseUrl: `https://api.atlassian.com/jsm/ops/api/${getEnvVar('CLOUD_ID')}`,
        apiKey: getEnvVar('API_KEY_JSM'),
    },
    opsgenie: {
        baseUrl: 'https://api.opsgenie.com',
        apiKey: getEnvVar('API_KEY_OPSGENIE'),
    },
    slack: {
        token: getEnvVar('SLACK_BOT_TOKEN'),
        channelId: getEnvVar('SLACK_CHANNEL_ID'),
        userGroupId: getEnvVar('SLACK_USERGROUP_ID'),
    },
    scheduleName: 'Platform_schedule',
} as const;

export type Config = typeof config;