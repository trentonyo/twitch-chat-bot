import { Pool } from 'pg';
import {User} from "../models/user.models";

export class DBModel {

    constructor(public dbPool: Pool) { }

    async getUser(username: string): Promise<User> {
        const res = await this.dbPool.query(`SELECT * FROM users WHERE username = '${username}'`);

        return new User(res.rows[0])
    }

    async updateUser(modified: User): Promise<void> {
        const query = `UPDATE users SET 
            username = '${modified.username}',
            score = ${modified.score},
            gold_stars = ${modified.gold_stars},
            role = ${modified.role},
            watch_seconds = ${modified.watch_seconds},
            created_at = '${modified.created_at.toISOString()}',
            last_seen = '${modified.last_seen.toISOString()}'
            WHERE id = ${modified.id}`;

        await this.dbPool.query(query);
    }
}