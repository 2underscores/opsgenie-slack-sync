import {syncSlackWithOpsgenie, type ScheduleToSlackGroupChannel} from "./src/syncOpsgenieSlack.js";


const RosterSlackMappings: ScheduleToSlackGroupChannel[] = [
  // {
  //     opsgenieScheduleName: 'Platform_schedule',
  //     slackChannelName: 'squad-platform',
  //     slackChannelId: 'C084X18A92N',
  //     slackGroupName: 'Platform Support',
  // },
  {
    opsgenieScheduleName: 'Platform_schedule',
    // slackChannelName: 'tmp-test-opsgenie-sync',
    slackChannelId: 'C084X18A92N',
    slackGroupName: 'Platform Support',
  },
]
await syncSlackWithOpsgenie(RosterSlackMappings);