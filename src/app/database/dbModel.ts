import { Pool } from 'pg';
import {User} from "../models/user.models";

export class DBModel {

    constructor(public dbPool: Pool) { }

    async getUser(username: string, updateLastSeen: boolean = true): Promise<User> {
        const updateQuery = `UPDATE users
                             SET last_seen = NOW()
                             WHERE username = '${username}'
                             RETURNING *`;
        const getQuery = `SELECT * FROM users WHERE username = '${username}'`

        const res = await this.dbPool.query(updateLastSeen ? updateQuery : getQuery);

        // Create the user if none exists for this username
        if (res.rows.length === 0) {
            const newUser = new User({
                username: username,
                score: 0,
                gold_stars: 0,
                role: 0,
                watch_seconds: 0,
                created_at: new Date(),
                last_seen: new Date()
            });

            const insertQuery = `
                INSERT INTO users (username, score, gold_stars, role, watch_seconds, created_at, last_seen) 
                VALUES ('${newUser.username}', ${newUser.score}, ${newUser.gold_stars}, '${newUser.role}', 
                ${newUser.watch_seconds}, '${newUser.created_at.toISOString()}', '${newUser.last_seen.toISOString()}')
                RETURNING *;
            `;

            const insertRes = await this.dbPool.query(insertQuery);
            return new User(insertRes.rows[0]);
        }

        let oldUser = new User(res.rows[0])
        oldUser.notNew()
        return oldUser
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

    async giveUsernameStars(username: string, numberOfStars: number = 1): Promise<void> {
        let target = await this.getUser(username)
        target.gold_stars += numberOfStars
        await this.updateUser(target)
    }

    async giveUserStars(user: User, numberOfStars: number = 1): Promise<void> {
        user.gold_stars += numberOfStars
        await this.updateUser(user)
    }

    async giveUsernamePoints(username: string, numberOfPoints: number = 1): Promise<void> {
        let target = await this.getUser(username)
        target.score += numberOfPoints
        await this.updateUser(target)
    }

    async giveUserPoints(user: User, numberOfPoints: number = 1): Promise<void> {
        user.score += numberOfPoints
        await this.updateUser(user)
    }
}