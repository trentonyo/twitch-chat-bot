import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';
import {DBModel} from "../database/dbModel";

export class BehaviorClass implements IChatCommand {
    command = "!ramble";
    twitchClient: TwitchClient;
    database: DBModel;

    believeRegex = /\b(?:believ|beleiv|beliv|belief)(e)*(r|s|ing)?\b/i;
    denyRegex = /\b(?:deny|deni|denie|denial|denia)(r|s|ing)?\b/i;
    
    constructor(twitchClient: TwitchClient, database: DBModel) {
        this.twitchClient = twitchClient;
        this.database = database;
    }

    async execute(channel: any, tags: any, message: any) {
        let ramble = await this.database.getRamble() // Does not need a null check because this call can create a new Ramble

        if (!ramble) // Safety check
            return

        let believer = false
        let denier = false
        let neutral = false
        let defector = false

        let lex = message.split(" ").slice(1)
        for (const i in lex) {
            const token = lex[i]

            if (token.match(this.believeRegex))
            {
                defector = ramble.makeBeliever(tags.username)
                believer = true
            } else if (token.match(this.denyRegex)) 
            {
                defector = ramble.makeDenier(tags.username)
                denier = true
            } else 
            {
                ramble.addTag(token)
            }
        }

        if (!denier && !believer) {
            neutral = ramble.makeNeutral(tags.username)
        }

        let msg = ""
        const sortedTags = ramble.getSortedTags()

        let tagsSnippet = "[ramble tags: "
        for (let i = 0; i < sortedTags.length; i++) {
            if (i > 0)
                tagsSnippet += " "
            tagsSnippet += `${sortedTags[i][0]}`
            tagsSnippet += "+".repeat(Math.max(0, sortedTags[i][1] - 1))
        }
        tagsSnippet += "]"

        if (ramble.isNew()) {
            msg = `Strap in everyone... ${tags.username} thinks Trenton is rambling again`

            if (believer)
                msg += ", and is all for it"
            if (denier)
                msg += ", and they are not so sure about this one"

            msg += "!"
        } else {
            // User is declaring their stance for the first time (or from neutral)
            if (!defector) {
                msg = `Count ${tags.username}`

                if (believer) {
                    msg += " as a believer"
                    // ramble.addBeliever(tags.username)
                } else if (denier) {
                    msg += " as a denier"
                    // ramble.addDenier(tags.username)
                } else {
                    msg += " in on the ramble (undeclared)"
                }
            } else {
                if (believer && defector) {
                    msg = `${tags.username} turns! Now they are team BELIEVE!`
                } else if (denier && defector) {
                    msg = `${tags.username} defects! Now they are team DENY!`
                } else if (neutral) {
                    msg = `${tags.username} is on the fence, they are team NEUTRAL!`
                }
            }
        }

        msg += `\n${tagsSnippet}`

        this.twitchClient.say(channel, msg);
        await this.database.updateRamble(ramble)
    }
}