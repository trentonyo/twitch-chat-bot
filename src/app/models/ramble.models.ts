import {IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsString} from "class-validator";
import {type} from "node:os";

export const DEFAULT_PARTICIPANTS = {"believers": [], "deniers": [], "neutrals": []}

export class Ramble {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsObject()
    tags: object;

    @IsNotEmpty()
    @IsObject()
    participants: object;

    @IsNotEmpty()
    @IsDate()
    started_at: Date;

    @IsNotEmpty()
    @IsDate()
    ended_at: Date;

    newRamble: boolean;

    constructor(
        res: object
    ) {
        this.id = res["id"];
        this.tags = res["tags"] || {};
        this.participants = res["believers"] || DEFAULT_PARTICIPANTS
        this.started_at = res["started_at"];
        this.ended_at = res["ended_at"];
        this.newRamble = true
    }

    isNew(): boolean {
        return this.newRamble;
    }

    notNew(): void {
        this.newRamble = false;
    }

    getSortedTags(): [string, any][] {
        return Object.entries(this.tags).sort(([, valueA], [, valueB]) => valueB - valueA);
    }

    // getUserStance(username: string) {
    //     return this.believers.includes(username) ? "believer" : this.deniers.includes(username) ? "denier" : "neutral";
    // }
    //
    // addBeliever(username: string) {
    //     if (typeof this.believers === typeof [""]) {
    //         this.believers.push(username);
    //     } else {
    //         this.believers = [username]
    //     }
    // }
    //
    // addDenier(username: string) {
    //     if (typeof this.believers === typeof [""]) {
    //         this.deniers.push(username);
    //     } else {
    //         this.believers = [username]
    //     }
    // }
    //
    // removeBeliever(username: string) {
    //     this.believers = this.believers.filter(believer => believer !== username);
    // }
    //
    // removeDenier(username: string) {
    //     this.deniers = this.deniers.filter(denier => denier !== username);
    // }

    addTag(tag: string) {
        if (this.tags && this.tags[tag]) {
            this.tags[tag] += 1;
        } else {
            this.tags = this.tags || {};
            this.tags[tag] = 1;
        }
    }
}