import { Pool } from 'pg';
import {User} from "../models/user.models";

export class DBModel {

    constructor(public dbPool: Pool) { }

    async getUser(username: string): Promise<User> {
        const res = await this.dbPool.query(`SELECT * FROM users WHERE username = '${username}'`);

        return new User(res.rows[0])
    }
}