import dotenv from 'dotenv';
dotenv.config();

export const config = {
  opsGenieApiKey: process.env.OPSGENIE_API_KEY,
  scheduleId: process.env.OPSGENIE_SCHEDULE_ID,
  opsGenieApiUrl: 'https://api.opsgenie.com/v2'
};