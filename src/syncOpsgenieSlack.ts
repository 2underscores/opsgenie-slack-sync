import * as url from "url";
import { getAllSchedules, getOncallUserEmailFromSchedule } from "./opsgenieOncalls.js"

interface ScheduleToSlackGroupChannel {
    opsgenieScheduleName: string,
    slackChannelName?: string,
    slackSupportGroupName?: string,
}

async function syncSlackWithOpsgenie(rosterSlackMappings: ScheduleToSlackGroupChannel[]) {

    const allOpsgenieSchedules = await getAllSchedules()
    // TODO: Parallelise
    for (const scheduleMap of rosterSlackMappings) {
        // Get email of user oncall for schedule
        console.log({ schedule: scheduleMap.opsgenieScheduleName });
        const schedule = allOpsgenieSchedules.find((sched: any) => sched.name === scheduleMap.opsgenieScheduleName)
        const oncallEmail = await getOncallUserEmailFromSchedule(schedule.id)
        console.log({ oncallEmail, schedule: scheduleMap.opsgenieScheduleName });
        // 
    }
}

if (url.fileURLToPath(import.meta.url) === process.argv[1]) {
    // eslint-disable-next-line es-x/no-top-level-await
    const RosterSlackMappings: ScheduleToSlackGroupChannel[] = [
        {
            opsgenieScheduleName: 'Platform_schedule',
            slackChannelName: '#tmp-test-opsgenie-sync',
            slackSupportGroupName: 'Platform Support', // Or "@platform-support"?
        },
    ]
    await syncSlackWithOpsgenie(RosterSlackMappings);
}