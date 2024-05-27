import { UserInputError } from 'apollo-server';
import { checkUserAuthorization } from '../../utils.js';

function queryValuesForDB(data) {
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(data);
    return { fields, placeholders, values }
}

export const postResolver = {
    Query: {
        getPostByUserId: async (_, { userid }, { pool, req, res }) => {
            try {
                checkUserAuthorization(req);
                let posts = await pool.query(
                    `SELECT * FROM posts WHERE userid=$1`,
                    [userid]
                )
                posts = posts?.rows;
                return posts;
            } catch (error) {
                console.log(error)
                throw new UserInputError(error);
            }
        },
        getFeedAndUserProfile: async (_, { }, { pool, req, res }) => {
            try {
                checkUserAuthorization(req);
                let user = await pool.query(
                    `SELECT * FROM users WHERE id=$1`,
                    [req.user.id]
                )
                let feed = await pool.query(`
                    SELECT * FROM posts INNER JOIN users ON posts.userid = users.id WHERE users.id IN (
                        SELECT followingid from follows WHERE followerid=$1
                    )
                `, [req.user.id])

                user = user.rows ? user.rows[0] : null
                feed = feed.rows ? feed.rows : []

                return { user, feed }
            } catch (error) {
                console.log(error)
                throw new UserInputError(error);
            }
        }

    },
    Mutation: {
        uploadPost: async (_, { post }, { pool, req, res }) => {
            try {
                checkUserAuthorization(req)
                const { fields, placeholders, values } = queryValuesForDB(post)
                let postObj = await pool.query(
                    `INSERT INTO posts (${fields}) VALUES (${placeholders}) RETURNING *`,
                    values
                )
                postObj = postObj?.rows[0];
                return postObj;
            } catch (error) {
                console.log(error)
                throw new UserInputError(error);
            }
        },
        likePost: async (_, { like }, { pool, req, res }) => {
            try {
                checkUserAuthorization(req)
                const { fields, placeholders, values } = queryValuesForDB(like)
                let likeObj = await pool.query(
                    `INSERT INTO likes (${fields}) VALUES (${placeholders}) RETURNING *`,
                    values
                )
                likeObj = likeObj?.rows[0];
                return likeObj;
            } catch (error) {
                console.log(error)
                throw new UserInputError(error);
            }
        },
        commentPost: async (_, { comment }, { pool, req, res }) => {
            try {
                checkUserAuthorization(req)
                const { fields, placeholders, values } = queryValuesForDB(comment)
                let commentObj = await pool.query(
                    `INSERT INTO comments (${fields}) VALUES (${placeholders}) RETURNING *`,
                    values
                )
                commentObj = commentObj?.rows[0];
                return commentObj;
            } catch (error) {
                console.log(error)
                throw new UserInputError(error);
            }
        }
    },
    Post: {
        comments: async (obj, { comment }, { pool, req, res }) => {
            try {
                let comments = await pool.query(
                    `SELECT * FROM comments WHERE postid=$1`,
                    [obj.id]
                )

                return comments?.rows
            } catch (error) {
                console.log(error)
            }
        },
        likes: async (obj, { like }, { pool, req, res }) => {
            try {
                let likes = await pool.query(
                    `SELECT * FROM likes WHERE postid=$1`,
                    [obj.id]
                )
                return likes?.rows
            } catch (error) {
                console.log(error)
            }
        },
        user: async (obj, { }, { pool, req, res }) => {
            try {
                let user = await pool.query(
                    `SELECT * FROM users WHERE id=$1`,
                    [obj.userid]
                )
                return user.rows ? user.rows[0] : null
            } catch (error) {
                console.log(error)
            }
        }
    }
}