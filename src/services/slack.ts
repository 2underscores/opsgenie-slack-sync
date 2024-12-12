// src/services/slack.ts
import { WebClient } from '@slack/web-api';

export class SlackService {
  private client: WebClient;
  
  constructor(token: string) {
    this.client = new WebClient(token);
  }

  async sendMessage(channelId: string, message: string): Promise<void> {
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
      console.log({resp});
      console.log('?');
      
    } catch (error) {
      console.error('Error sending Slack message:', error);
      throw error;
    }
  }

  async updateUserGroupMembers(
    userGroupId: string, 
    userIds: string[]
  ): Promise<void> {
    try {
      await this.client.usergroups.users.update({
        usergroup: userGroupId,
        users: userIds.join(',')
      });
    } catch (error) {
      console.error('Error updating user group:', error);
      throw error;
    }
  }

  // Helper method to get user ID by email
  async getUserIdByEmail(email: string): Promise<string | null> {
    try {
      const response = await this.client.users.lookupByEmail({
        email: email
      });
      return response.user?.id || null;
    } catch (error) {
      console.error('Error looking up user:', error);
      return null;
    }
  }
}