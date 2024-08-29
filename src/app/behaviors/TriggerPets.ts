import { IChatCommand } from './IChatCommand';
import { TwitchClient } from 'tmi.js';
import {IChatTrigger} from "./IChatTrigger";

export class BehaviorClass implements IChatTrigger {
    regex = /\b(dog|dogs|doggy|doggies|doggo|doggos|pup|puppies|puppers|cat|cats|kitty|kitties|bird|birds|fish|fishies|rabbit|rabbits|bunny|bunnies|hamster|hamsters|turtle|turtles|lizard|lizards|snake|snakes|gerbil|gerbils|parrot|parrots|guinea pig|guinea pigs|ferret|ferrets|ox|oxen|horse|horses)\b/ig;
    twitchClient: TwitchClient;

    constructor(twitchClient: TwitchClient, _: any) {
        this.twitchClient = twitchClient;
    }

    execute(channel: any, tags: any, message: any) {
        let petIterator = message.matchAll(this.regex);

        let pets = Array.from(petIterator, ([first]) => {
            return first;
        });
        
        let response = "";
        switch (pets.length) {
            case 1:
                if (["cat", "cats", "kitty", "kitties"].includes(pets[0].toLowerCase())) {
                    response = `(tell your ${pets[0]} we said pspspspspsps, ${tags.username})`;
                } else {
                    response = `(Say hi to your ${pets[0]} for us, ${tags.username}!)`;
                }
                break;
            case 2:
                response = `(Say hi to your ${pets[0]} and ${pets[1]} for us, ${tags.username}!)`;
                break;
            default:
                response = "(Say hi to your "
                for (let i = 0; i < pets.length - 1; i++) {
                    response += `${pets[i]}, `
                }
                response += `and ${pets[pets.length - 1]} for us, ${tags.username}!)`;
        }

        this.twitchClient.say(channel, response);
    }
}