import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';
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

        let targets = message.split(" ").slice(1)
        if (user.isMod() && targets.length > 0) {
            for (let targetUser in targets) {
                let user = await this.database.getUser(targets[targetUser], false)
                await this.database.giveUserStars(user);
            }
        } else {
            this.twitchClient.say(channel, `${user.username} has ⭐${user.gold_stars}`);
        }
    }
}