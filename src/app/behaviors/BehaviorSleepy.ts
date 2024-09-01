import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';

export class BehaviorClass implements IChatCommand {
    command = "!zzz";
    twitchClient: TwitchClient;

    constructor(twitchClient: TwitchClient, _: any) {
        this.twitchClient = twitchClient;
    }

    execute(channel: any, tags: any, message: any) {
        this.twitchClient.say(channel, `${tags.username} thinks Jessica is lookin' sleepy 😴`);
    }
}