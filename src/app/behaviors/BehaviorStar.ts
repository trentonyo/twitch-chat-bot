import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';
import { Pool } from 'pg';
import {DBModel} from "../database/dbModel";

export class BehaviorClass implements IChatCommand {
    command = "!star";
    twitchClient: TwitchClient;
    database: DBModel;

    constructor(twitchClient: TwitchClient, database: DBModel) {
        this.twitchClient = twitchClient;
        this.database = database;
    }

    async execute(channel: any, tags: any, message: any) {
        const user = await this.database.getUser(tags.username)

        this.twitchClient.say(channel, `${user.username} has ${user.gold_stars} stars!`);
    }
}