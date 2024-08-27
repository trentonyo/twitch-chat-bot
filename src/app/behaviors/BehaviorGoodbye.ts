import { IBehavior } from './IBehavior';
import { TwitchClient } from 'tmi.js';

export class BehaviorClass implements IBehavior {
    command = "!goodbye";
    twitchClient: TwitchClient;

    constructor(twitchClient: TwitchClient) {
        this.twitchClient = twitchClient;
    }

    execute(channel: any, tags: any, message: any) {
        this.twitchClient.say(channel, `Goodbye, ${tags.username}! See you next time.`);
    }
}