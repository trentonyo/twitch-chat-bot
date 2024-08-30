import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class User {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    tags: string;

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

    newUser: boolean;

    constructor(
        res: object
    ) {
        this.id = res["id"];
        this.tags = res["tags"];
        this.believers_json = res["believers_json"];
        this.deniers_json = res["deniers_json"];
        this.started_at = res["started_at"];
        this.ended_at = res["ended_at"];
        this.newUser = true
    }

}