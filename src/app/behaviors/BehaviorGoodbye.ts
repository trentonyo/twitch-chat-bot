import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';

export class BehaviorClass implements IChatCommand {
    command = "!goodbye";
    twitchClient: TwitchClient;

    constructor(twitchClient: TwitchClient) {
        this.twitchClient = twitchClient;
    }

    execute(channel: any, tags: any, message: any) {
        this.twitchClient.say(channel, `Goodbye, ${tags.username}! See you next time.`);
    }
}