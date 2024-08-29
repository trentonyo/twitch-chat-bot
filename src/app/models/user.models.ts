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
    created_at: object;

    @IsNotEmpty()
    @IsDate()
    last_seen: object;

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
    }

}