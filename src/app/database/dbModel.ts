import { Pool } from 'pg';
import { User } from "../models/user.models";
import { Ramble } from "../models/ramble.models";

export class DBModel {

    constructor(public dbPool: Pool) { }

    /*************
     * User stuff
     */
    async getUser(username: string, updateLastSeen: boolean = true): Promise<User> {
        const updateQuery = `UPDATE users
                             SET last_seen = NOW()
                             WHERE username = $1
                             RETURNING *`;
        const getQuery = `SELECT * FROM users WHERE username = $1`;

        const res = await this.dbPool.query(updateLastSeen ? updateQuery : getQuery, [username]);

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
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;
            `;

            const insertRes = await this.dbPool.query(insertQuery, [
                newUser.username,
                newUser.score,
                newUser.gold_stars,
                newUser.role,
                newUser.watch_seconds,
                newUser.created_at.toISOString(),
                newUser.last_seen.toISOString()
            ]);
            return new User(insertRes.rows[0]);
        }

        let oldUser = new User(res.rows[0])
        oldUser.notNew()
        return oldUser
    }

    async updateUser(modified: User): Promise<void> {
        const query = `UPDATE users SET 
            username = $1,
            score = $2,
            gold_stars = $3,
            role = $4,
            watch_seconds = $5,
            created_at = $6,
            last_seen = $7
            WHERE id = $8`;

        await this.dbPool.query(query, [
            modified.username,
            modified.score,
            modified.gold_stars,
            modified.role,
            modified.watch_seconds,
            modified.created_at.toISOString(),
            modified.last_seen.toISOString(),
            modified.id
        ]);
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

    /************
     * Ramble stuff
     */
    async getRamble(canCreateNew: boolean = true): Promise<Ramble | null> {
        const getQuery = `SELECT *
                          FROM rambles
                          WHERE ended_at IS NULL`;

        // Try to get a running ramble
        const res = await this.dbPool.query(getQuery);

        // If this call should not initialize a new Ramble, return null
        if (!canCreateNew && res.rows.length === 0)
            return null

        // If there is not a ramble started, start one
        if (res.rows.length === 0) {
            const newRamble = new Ramble({
                tags: {},
                participants: {believers: [], deniers: [], neutrals: []},
                started_at: new Date(),
                ended_at: null,
                newRamble: true
            });

            const insertQuery = `
                INSERT INTO rambles (tags, participants, started_at, ended_at)
                VALUES ($1, $2, $3, $4)
                    RETURNING *;
            `;

            const insertRes = await this.dbPool.query(insertQuery, [
                newRamble.tags,
                newRamble.participants,
                newRamble.started_at.toISOString(),
                null
            ]);

            return new Ramble(insertRes.rows[0]);
        }

        let existingRamble = new Ramble(res.rows[0])
        existingRamble.notNew()
        return existingRamble;
    }

    async updateRamble(ramble: Ramble): Promise<void> {
        const query = `
            UPDATE rambles SET
                   tags = $1,
                   participants = $2,
                   started_at = $3,
                   ended_at = $4
            WHERE id = $5;
        `;

        const values = [
            ramble.tags,
            ramble.participants,
            ramble.started_at?.toISOString() ?? null,
            ramble.ended_at?.toISOString() ?? null,
            ramble.id
        ];

        await this.dbPool.query(query, values);
    }
}