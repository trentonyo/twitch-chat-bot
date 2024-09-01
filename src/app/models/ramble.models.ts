import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class Ramble {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    tags_json: string;

    @IsNotEmpty()
    @IsString()
    believers_json: string;

    @IsNotEmpty()
    @IsString()
    deniers_json: string;

    @IsNotEmpty()
    @IsDate()
    started_at: Date;

    @IsNotEmpty()
    @IsDate()
    ended_at: Date;

    newRamble: boolean;
    believers: string[];
    deniers: string[];
    tags: {string: number}

    constructor(
        res: object
    ) {
        this.id = res["id"];
        this.tags_json = res["tags_json"];
        this.believers_json = res["believers_json"];
        this.deniers_json = res["deniers_json"];
        this.started_at = res["started_at"];
        this.ended_at = res["ended_at"];
        this.newRamble = true

        this.believers = JSON.parse(this.believers_json) || [];
        this.deniers = JSON.parse(this.deniers_json) || [];
        this.tags = JSON.parse(this.tags_json) || {};
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

    getUserStance(username: string) {
        return this.believers.includes(username) ? "believer" : this.deniers.includes(username) ? "denier" : "neutral";
    }

    addBeliever(username: string) {
        this.believers.push(username);
        this.believers_json = JSON.stringify(this.believers)
    }

    addDenier(username: string) {
        this.deniers.push(username);
        this.deniers_json = JSON.stringify(this.deniers)
    }

    removeBeliever(username: string) {
        this.believers = this.believers.filter(believer => believer !== username);
        this.believers_json = JSON.stringify(this.believers)
    }

    removeDenier(username: string) {
        this.deniers = this.deniers.filter(denier => denier !== username);
        this.deniers_json = JSON.stringify(this.deniers)
    }

    addTag(tag: string) {
        if (this.tags && this.tags[tag]) {
            this.tags[tag] += 1;
        } else {
            this.tags = this.tags || {};
            this.tags[tag] = 1;
        }
        this.tags_json = JSON.stringify(this.tags)
    }
}