import { syncSlackWithOpsgenie, type ScheduleToSlackGroupChannel } from "./src/syncOpsgenieSlack.js";

const RosterSlackMappings: ScheduleToSlackGroupChannel[] = [
  // Actual Platform squad alerting. Sends message and updates support group
  {
    opsgenieScheduleName: 'Platform_schedule',
    // slackChannelName: 'squad-platform', // Can be provided, but expensive paginated API call. Use Channel ID instead
    // slackChannelId: 'C05MD9Y10P9',
    slackChannelId: 'C084X18A92N', // Sends to #tmp-test-opsgenie-sync,
    slackGroupName: 'Platform Support',
  },
  // // Example Squad1 only update group membership
  // {
  //   opsgenieScheduleName: 'Squad1schedule',
  //   slackGroupName: 'Squad1 Roster',
  // },
  // // Example squad2 only send message to channel
  // {
  //   opsgenieScheduleName: 'Squad2 - Operations Schedule',
  //   slackChannelId: 'C084X18A92N', // Sends to #tmp-test-opsgenie-sync,
  // },
  // // Other squad configs below here
]

await syncSlackWithOpsgenie(RosterSlackMappings);