import * as url from "url";
import { getAllSchedules } from "./opsgenieOncalls.js"

interface ScheduleToSlackGroupChannel {
    opsgenieScheduleName: string,
    slackChannelName?: string,
    slackSupportGroupName?: string,
}

async function syncSlackWithOpsgenie() {
    const RosterSlackMappings: ScheduleToSlackGroupChannel[] = [
        {
            opsgenieScheduleName: 'Platform_schedule',
            slackChannelName: '#tmp-test-opsgenie-sync',
            slackSupportGroupName: 'Platform Support', // Or "@platform-support"?
        },
    ]

    const allOpsgenieSchedules = await getAllSchedules()
    RosterSlackMappings.forEach(rosterSlackMap => {
        const schedule = allOpsgenieSchedules.find((sched: any) => sched.name === rosterSlackMap.opsgenieScheduleName)
        console.log({ schedule });

    })

}

if (url.fileURLToPath(import.meta.url) === process.argv[1]) {
    // eslint-disable-next-line es-x/no-top-level-await
    await syncSlackWithOpsgenie();
}