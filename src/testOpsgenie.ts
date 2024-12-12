import axios from 'axios';
import dotenv from 'dotenv';

// Resources
// https://docs.opsgenie.com/docs
// https://developer.atlassian.com/cloud/jira/service-desk-ops/rest/v2/intro/

async function fetchOncallJsm() {
  const CLOUD_ID = '1108a0eb-89f6-446d-8589-48bb8beb47e4' // https://constantinople.atlassian.net/_edge/tenant_info
  const BASE_URL = `https://api.atlassian.com/jsm/ops/api/${CLOUD_ID}`
  const PLATFORM_SCHED_NAME = 'Platform_schedule'
  const API_KEY = process.env.API_KEY_JSM;

  if (!API_KEY) {
    console.error('Please set API_KEY_JSM in your .env file');
    process.exit(1);
  }

  const headers = {
    'Authorization': `Basic ${Buffer.from(`jeremys@cxnpl.com:${API_KEY}`).toString('base64')}`,
    'Accept': 'application/json'
  }

  const allSchedules = (await axios.get(`${BASE_URL}/v1/schedules`, { headers })).data.values
  const platSchedule = allSchedules.find(sched => sched.name === PLATFORM_SCHED_NAME)
  const respPlatOncalls = (await axios.get(`${BASE_URL}/v1/schedules/${platSchedule.id}/on-calls`, { headers })).data.onCallParticipants;
  console.log({ respPlatOncalls }); // {onCallParticipants: [{ id: '712020:7ebd2cde-1921-4213-972c-888bf0363855', type: 'user' }]}
  // TODO: What is that ID https://developer.atlassian.com/cloud/jira/service-desk-ops/rest/v2/api-group-schedule-on-calls/#api-v1-schedules-scheduleid-on-calls-get

}

async function fetchOncallOpsgenie() {
  const BASE_URL = `https://api.opsgenie.com`
  const API_KEY = process.env.API_KEY_OPSGENIE;
  const PLATFORM_SCHED_NAME = 'Platform_schedule'

  if (!API_KEY) {
    console.error('Please set API_KEY_OPSGENIE in your .env file');
    process.exit(1);
  }

  const headers = {
    'Authorization': `GenieKey ${API_KEY}`,
    'Accept': 'application/json'
  }

  const allSchedules = (await axios.get(`${BASE_URL}/v2/schedules`, { headers })).data.data
  const platSchedule = allSchedules.find(sched => sched.name === PLATFORM_SCHED_NAME)
  const platOncall = (await axios.get(`${BASE_URL}/v2/schedules/${platSchedule.id}/on-calls`, { headers })).data.data.onCallParticipants[0]
  console.log({ platOncall });
}


dotenv.config();
fetchOncallOpsgenie();
fetchOncallJsm();
