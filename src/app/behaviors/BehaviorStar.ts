import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';
import { Pool } from 'pg';

export class BehaviorClass implements IChatCommand {
    command = "!star";
    twitchClient: TwitchClient;
    dbPool: Pool;

    constructor(twitchClient: TwitchClient, dbPool: Pool) {
        this.twitchClient = twitchClient;
        this.dbPool = dbPool;
    }

    async execute(channel: any, tags: any, message: any) {
        const res = await this.dbPool.query(`SELECT * FROM users`)

        this.twitchClient.say(channel, `STAR: ${res}`);
    }
}