import { UserInputError } from 'apollo-server';

export const followResolver = {
    Mutation: {
        follow: async (_, { followingid }, { pool, req, res }) => {
            try {
                let followObj = await pool.query(
                    `INSERT INTO follows (followerid, followingid) VALUES ($1, $2) RETURNING *`,
                    [req.user.id, followingid]
                );
                if (followObj && followObj.rows)
                    return followObj.rows[0].id
            } catch (error) {
                console.log(error)
                // throw new UserInputError(error);
                return res.json({ error });
            }
        },
        unfollow: async (_, { followingid }, { pool, req, res }) => {
            try {
                let followObj = await pool.query(
                    `DELETE FROM follows WHERE followerid=$1 AND followingid=$2 RETURNING *`,
                    [req.user.id, followingid]
                );
                if (followObj && followObj.rows)
                    return followObj.rows[0].id
            } catch (error) {
                console.log(error)
                // throw new UserInputError(error);
                return res.json({ error });
            }
        }
    }
}