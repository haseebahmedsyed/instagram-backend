import { UserInputError } from 'apollo-server';
import { queryValuesForDB, sheculeArchiving, cancelArchiving } from "../../utils.js"

export const storyResolver = {
    Mutation: {
        createStory: async (_, { story }, { pool, req, res }) => {
            try {
                const { fields, placeholders, values } = queryValuesForDB(story)
                let storyObj = await pool.query(
                    `INSERT INTO stories (${fields}) VALUES (${placeholders}) RETURNING *`,
                    values
                )
                storyObj = storyObj?.rows[0];
                sheculeArchiving('stories', storyObj.id, pool);
                return storyObj;
            } catch (error) {
                console.log(error)
                // throw new UserInputError(error);
                return res.json({ error });
            }
        },
        deleteStory: async (_, { id }, { pool, req, res }) => {
            try {
                let storyObj = await pool.query(
                    `DELETE FROM stories WHERE id=$1 RETURNING *`,
                    [id]
                )
                storyObj = storyObj?.rows[0];
                await pool.query(
                    `DELETE FROM storyviewers WHERE storyid=$1`,
                    [storyObj.id]
                )
                cancelArchiving('stories', storyObj.id);
                return storyObj.id;
            } catch (error) {
                console.log(error)
                // throw new UserInputError(error);
                return res.json({ error });
            }
        },
        viewStory: async (_, { storyid }, { pool, req, res }) => {
            let hasViewStory = await pool.query(
                `SELECT * FROM storyviewers WHERE storyid=$1 AND viewerid=$2`,
                [storyid, req.user.id]
            )
            if (hasViewStory?.rows?.length == 0) {
                let viewObj = await pool.query(
                    `INSERT INTO storyviewers (viewerid,storyid) VALUES ($1,$2) RETURNING *`,
                    [req.user.id, storyid]
                )
                return viewObj?.rows[0];
            }
            else {
                return hasViewStory?.rows[0];
            }
        }
    },
    Story: {
        user: async (obj, { story }, { pool, req, res }) => {
            try {
                let user = await pool.query(
                    `SELECT * FROM users WHERE id=$1`,
                    [obj.userid]
                )
                return user.rows ? user.rows[0] : null
            } catch (error) {
                console.log(error)
            }
        },
        viewers: async (obj, { }, { pool, req, res }) => {
            try {
                let viewers = await pool.query(
                    `SELECT * FROM users WHERE users.id IN (SELECT viewerid FROM storyviewers WHERE storyid=$1)`,
                    [obj.storyid]
                )
                return viewers.rows;
            } catch (error) {
                console.log(error)
            }
        }
    }
}