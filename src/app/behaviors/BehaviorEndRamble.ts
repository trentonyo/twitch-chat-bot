import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';
import {DBModel} from "../database/dbModel";

export class BehaviorClass implements IChatCommand {
    command = "!unramble";
    twitchClient: TwitchClient;
    database: DBModel;

    constructor(twitchClient: TwitchClient, database: DBModel) {
        this.twitchClient = twitchClient;
        this.database = database;
    }

    async execute(channel: any, tags: any, message: any) {
        let executor = await this.database.getUser(tags.username)

        if (executor.isMod()) {
            let ramble = await this.database.getRamble()

            let [winners, losers, neutrals, winGroup] = ramble.end();

            let msg = `Victory goes to the ${winGroup}! Stars all around. (the unwinners and neutrals get some points, too)`
            if (winGroup === "TIE") {
                msg = "It's a tie! Everyone who participated in the ramble gets some points!"
            }

            // Give winners a star
            for (const winnersKey in winners) {
                const username = winners[winnersKey]
                await this.database.giveUsernameStars(username, 1); // TODO scale the value of these things, stars should be like 200 points
            }
            // Give losers points
            for (const losersKey in losers) {
                const username = losers[losersKey]
                await this.database.giveUsernamePoints(username, 50);
            }
            // Give neutrals points
            for (const neutralsKey in neutrals) {
                const username = neutrals[neutralsKey]
                await this.database.giveUsernamePoints(username, 100);
            }

            this.twitchClient.say(channel, msg);
            await this.database.updateRamble(ramble)
        }
    }
}