import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class User {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsNumber()
    score: number;

    @IsNotEmpty()
    @IsNumber()
    gold_stars: number;

    @IsNotEmpty()
    @IsNumber()
    role: number;

    @IsNotEmpty()
    @IsNumber()
    watch_seconds: number;

    @IsNotEmpty()
    @IsDate()
    created_at: Date;

    @IsNotEmpty()
    @IsDate()
    last_seen: Date;

    newUser: boolean;

    constructor(
        res: object
    ) {
        this.id = res["id"];
        this.username = res["username"];
        this.score = res["score"];
        this.gold_stars = res["gold_stars"];
        this.role = res["role"];
        this.watch_seconds = res["watch_seconds"];
        this.created_at = res["created_at"];
        this.last_seen = res["last_seen"];
        this.newUser = true
    }

    isMod(): boolean {
        return this.role >= 100;
    }

    isNew(): boolean {
        return this.newUser;
    }

    notNew(): void {
        this.newUser = false;
    }
}