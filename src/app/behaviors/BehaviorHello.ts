import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';

export class BehaviorClass implements IChatCommand {
    command = "!hello";
    twitchClient: TwitchClient;

    constructor(twitchClient: TwitchClient) {
        this.twitchClient = twitchClient;
    }

    execute(channel: any, tags: any, message: any) {
        this.twitchClient.say(channel, `Hello, ${tags.username}! Welcome to the channel.`);
    }
}