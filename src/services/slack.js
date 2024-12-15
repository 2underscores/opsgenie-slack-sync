import { WebClient } from '@slack/web-api';
export class SlackService {
    client;
    constructor(token) {
        this.client = new WebClient(token);
    }
    async sendMessage(channelId, message) {
        try {
            const resp = await this.client.chat.postMessage({
                channel: channelId,
                text: message,
                // Optional: make the message look nicer
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: message
                        }
                    }
                ]
            });
            return resp;
        }
        catch (error) {
            console.error('Error sending Slack message:', error);
            throw error;
        }
    }
    async setUserGroupMembers(userGroupId, userIds) {
        try {
            const resp = await this.client.usergroups.users.update({
                usergroup: userGroupId,
                users: userIds.join(',')
            });
            return resp;
        }
        catch (error) {
            console.error('Error updating user group:', error);
            throw error;
        }
    }
    // Helper method to get user ID by email
    async getUserIdByEmail(email) {
        try {
            const response = await this.client.users.lookupByEmail({
                email: email
            });
            return response.user?.id || null;
        }
        catch (error) {
            console.error('Error looking up user:', error);
            return null;
        }
    }
    // Helper method to get user group ID from name
    async getUserGroupIdByName(name) {
        try {
            // Get all user groups
            const response = await this.client.usergroups.list();
            if (!response.usergroups) {
                return null;
            }
            // Find the user group with matching name
            const userGroup = response.usergroups.find(group => group.name === name || group.handle === name);
            return userGroup?.id || null;
        }
        catch (error) {
            console.error('Error looking up user group:', error);
            return null;
        }
    }
    // Helper method to get channel ID from name
    async getChannelIdByName(name) {
        const channelName = name.replace(/^#/, ''); // Normalize name by removing leading #
        let cursor = undefined;
        try {
            do {
                // Fetch a page of channels excluding archived channels
                const response = await this.client.conversations.list({
                    types: 'public_channel,private_channel', // Adjust types if needed
                    exclude_archived: true, // Exclude archived channels
                    limit: 1000,
                    cursor
                });
                if (!response.channels) {
                    return undefined;
                }
                // Find the channel matching the given name
                console.log({ channelNames: response.channels.map(ch => ch.name) });
                const channel = response.channels.find(ch => ch.name === channelName);
                if (channel) {
                    return channel.id;
                }
                // Update cursor for next page
                cursor = response.response_metadata?.next_cursor;
                console.log({ cursor });
            } while (cursor); // Continue pagination until no cursor remains
            console.error(`Channel "${name}" not found.`);
            return undefined;
        }
        catch (error) {
            console.error('Error fetching channel ID:', error);
            throw error;
        }
    }
}
