import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';
import {randomInt} from "node:crypto";

export class BehaviorClass implements IChatCommand {
    command = "!rand";
    twitchClient: TwitchClient;

    constructor(twitchClient: TwitchClient) {
        this.twitchClient = twitchClient;
    }

    execute(channel: any, tags: any, message: any) {
        this.twitchClient.say(channel, `Your random is ${randomInt(100)}`);
    }
}