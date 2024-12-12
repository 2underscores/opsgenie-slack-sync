import dotenv from 'dotenv';
import { exit } from 'process';

dotenv.config();

const requiredEnvVars = [
    'API_KEY_JSM',
    'API_KEY_OPSGENIE',
] as const;

// Check for missing environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    exit(1);
}

// JSM (Jira Service Management) Configuration
const JSM_CONFIG = {
    cloudId: '1108a0eb-89f6-446d-8589-48bb8beb47e4',
    baseBaseUrl: 'https://api.atlassian.com/jsm/ops/api',
    get baseUrl() {
        return `${this.baseBaseUrl}/${this.cloudId}`;
    },
    apiKey: process.env.API_KEY_JSM,
} as const;

// OpsGenie Configuration
const OPSGENIE_CONFIG = {
    baseUrl: 'https://api.opsgenie.com',
    apiUrl: 'https://api.opsgenie.com/v2',
    apiKey: process.env.API_KEY_OPSGENIE,
} as const;

export const config = {
    jsm: JSM_CONFIG,
    opsgenie: OPSGENIE_CONFIG,
    scheduleName: 'Platform_schedule',
} as const;

export type Config = typeof config;
