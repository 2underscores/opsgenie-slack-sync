import axios from 'axios';
import { config } from './config';

async function fetchOncallJsm() {
  // https://developer.atlassian.com/cloud/jira/service-desk-ops/rest/v2/intro/
  const BASE_URL = config.jsm.baseUrl
  const API_KEY = config.jsm.apiKey
  const PLATFORM_SCHED_NAME = config.scheduleName

  const headers = {
    'Authorization': `Basic ${Buffer.from(`jeremys@cxnpl.com:${API_KEY}`).toString('base64')}`,
    'Accept': 'application/json'
  }

  const allSchedules = (await axios.get(`${BASE_URL}/v1/schedules`, { headers })).data.values
  const platSchedule = allSchedules.find((sched: any) => sched.name === PLATFORM_SCHED_NAME)
  const respPlatOncalls = (await axios.get(`${BASE_URL}/v1/schedules/${platSchedule.id}/on-calls`, { headers })).data.onCallParticipants;
  console.log({ respPlatOncalls }); // {onCallParticipants: [{ id: '712020:7ebd2cde-1921-4213-972c-888bf0363855', type: 'user' }]}
  // TODO: What is that ID https://developer.atlassian.com/cloud/jira/service-desk-ops/rest/v2/api-group-schedule-on-calls/#api-v1-schedules-scheduleid-on-calls-get
}

async function fetchOncallOpsgenie() {
  // https://docs.opsgenie.com/docs
  const BASE_URL = config.opsgenie.baseUrl
  const API_KEY = config.opsgenie.apiKey
  const PLATFORM_SCHED_NAME = config.scheduleName

  const headers = {
    'Authorization': `GenieKey ${API_KEY}`,
    'Accept': 'application/json'
  }

  const allSchedules = (await axios.get(`${BASE_URL}/v2/schedules`, { headers })).data.data
  const platSchedule = allSchedules.find((sched: any) => sched.name === PLATFORM_SCHED_NAME)
  const platOncall = (await axios.get(`${BASE_URL}/v2/schedules/${platSchedule.id}/on-calls`, { headers })).data.data.onCallParticipants[0]
  console.log({ platOncall });
}

fetchOncallOpsgenie();
fetchOncallJsm();
