import axios from 'axios';
export class OpsgenieService {
    opsgenieAxiosClient;
    constructor(apikey) {
        // Initialize OpsGenie client
        this.opsgenieAxiosClient = axios.create({
            baseURL: "https://api.opsgenie.com",
            headers: {
                'Authorization': `GenieKey ${apikey}`,
                'Accept': 'application/json'
            }
        });
    }
    // Fetching Schedules
    async getAllSchedules() {
        try {
            const response = await this.opsgenieAxiosClient.get('/v2/schedules');
            return response.data.data;
        }
        catch (error) {
            console.error('Error fetching OpsGenie schedules:', error);
            throw new Error('Failed to fetch OpsGenie schedules');
        }
    }
    async getScheduleFromName(scheduleName) {
        const schedules = await this.getAllSchedules();
        const schedule = schedules.find(sched => sched.name === scheduleName);
        if (!schedule) {
            throw new Error(`Schedule "${scheduleName}" not found`);
        }
        return schedule;
    }
    async getScheduleFromId(scheduleId) {
        const response = await this.opsgenieAxiosClient.get(`/v2/schedules/${scheduleId}`);
        return response.data.data;
    }
    /**
     * Fetch current on-call information from OpsGenie Schedule Name
     */
    async getOncallFromSchedule(scheduleId) {
        try {
            const response = await this.opsgenieAxiosClient.get(`/v2/schedules/${scheduleId}/on-calls`);
            return response.data.data.onCallParticipants;
        }
        catch (error) {
            console.error('Error fetching OpsGenie on-call info:', error);
            throw new Error('Failed to fetch OpsGenie on-call information');
        }
    }
}
