import { IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import 'reflect-metadata'; // Ensure this is imported for class-transformer to work

export interface Participants {
    believers: string[];
    deniers: string[];
    neutrals: string[];
}

export class Ramble {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsObject()
    tags: { [key: string]: number };

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Object)
    participants: Participants;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    started_at: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    ended_at: Date | null;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    elapsed: Date | null;

    newRamble: boolean;

    constructor(res: Partial<Ramble>) {
        this.id = res.id || 0;
        this.tags = res.tags || {};
        this.participants = res.participants || { believers: [], deniers: [], neutrals: [] };
        this.started_at = res.started_at ? new Date(res.started_at) : new Date();
        this.ended_at = res.ended_at ? new Date(res.ended_at) : null;
        this.elapsed = res.elapsed ? new Date(res.elapsed) : null;
        this.newRamble = res.newRamble || true;
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

    getUserStance(username: string): string {
        for (const [key, value] of Object.entries(this.participants)) {
            if (value.includes(username)) {
                return key;
            }
        }
        return "neutral";
    }

    private addBeliever(username: string): void {
        this.participants.believers.push(username);
    }

    private addDenier(username: string): void {
        this.participants.deniers.push(username);
    }

    private addNeutral(username: string): void {
        this.participants.neutrals.push(username);
    }

    private changeStance(username: string, addFunction: (username: string) => void): boolean {
        console.log(`== [changeStance] this.participants: ${JSON.stringify(this.participants)}`); // TODO Debug
        let defected = false;
        if (this.removeBeliever(username)) defected = true;
        if (this.removeDenier(username)) defected = true;
        if (this.removeNeutral(username)) defected = true;
        addFunction(username);
        return defected;
    }

    makeBeliever(username: string): boolean {
        return this.changeStance(username, this.addBeliever.bind(this));
    }

    makeDenier(username: string): boolean {
        return this.changeStance(username, this.addDenier.bind(this));
    }

    makeNeutral(username: string): boolean {
        return this.changeStance(username, this.addNeutral.bind(this));
    }

    private removeFromParticipantGroup(username: string, group: keyof Participants): boolean {
        const start = this.participants[group].length;
        console.log(`"${group}" BEFORE REMOVE: ${this.participants[group]}`); // TODO Debug
        this.participants[group] = this.participants[group].filter(participant => participant !== username);
        console.log(`"${group}" AFTER REMOVE : ${this.participants[group]}`); // TODO Debug
        return start !== this.participants[group].length;
    }

    removeBeliever(username: string): boolean {
        return this.removeFromParticipantGroup(username, "believers");
    }

    removeDenier(username: string): boolean {
        return this.removeFromParticipantGroup(username, "deniers");
    }

    removeNeutral(username: string): boolean {
        return this.removeFromParticipantGroup(username, "neutrals");
    }

    addTag(tag: string): void {
        if (this.tags && this.tags[tag]) {
            this.tags[tag] += 1;
        } else {
            this.tags[tag] = 1;
        }
    }

    end(): [string[], string[], string[], string] {
        this.ended_at = new Date();

        let winGroup: string;
        let winners: string[];
        let losers: string[];
        let neutrals: string[];

        if (this.participants.believers.length > this.participants.deniers.length) {
            winGroup = "BELIEVERS"
            winners = this.participants.believers
            losers = this.participants.deniers
            neutrals = this.participants.neutrals
        } else if (this.participants.deniers.length > this.participants.believers.length) {
            winGroup = "DENIERS"
            winners = this.participants.deniers
            losers = this.participants.believers
            neutrals = this.participants.neutrals
        } else {
            winGroup = "TIE"
            winners = []
            losers = []
            neutrals = [...this.participants.believers, ...this.participants.deniers, ...this.participants.neutrals];
        }

        return [winners, losers, neutrals, winGroup];
    }
}