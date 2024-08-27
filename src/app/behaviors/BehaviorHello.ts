import { IBehavior } from './IBehavior';
import { TwitchClient } from 'tmi.js';

export class BehaviorClass implements IBehavior {
    command = "!hello";
    twitchClient: TwitchClient;

    constructor(twitchClient: TwitchClient) {
        this.twitchClient = twitchClient;
    }

    execute(channel: any, tags: any, message: any) {
        this.twitchClient.say(channel, `Hello, ${tags.username}! Welcome to the channel.`);
    }
}